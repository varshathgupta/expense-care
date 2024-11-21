import { ID, Query } from "appwrite";
import { databases } from "../appwrite/appwrite-config";


/* To fetch data after any changes in the database or to fetch data into state on login*/
export async function fetchData() {
  const categoriesList = [];
  try {
    // Fetch categories and expenses in parallel
    const [categories, expenses] = await Promise.all([
      databases.listDocuments(
        import.meta.env.VITE_DB_ID,
        import.meta.env.VITE_DB_CATEGORY_ID
      ),
      databases.listDocuments(
        import.meta.env.VITE_DB_ID, 
        import.meta.env.VITE_DB_EXPENSE_ID
      )
    ]);
    categoriesList.push(...categories.documents.map(cat => cat.name)); // Use spread operator for cleaner code
    localStorage.setItem("CategoryList", JSON.stringify(categoriesList)); // Store as JSON string
    return {
      expenses: expenses.documents,
      categories: categories.documents
    };

  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw to allow error handling by caller
  }
}

/* To list expenses based on filtered items (category type, year, month, and name) */
export async function listFilteredExpenses(categoryType = null, startDate = null, endDate = null, searchName = null, sortBy = null) {
  try {
    const filters = [];
    const sortOptions = [];

    if (categoryType) {
      filters.push(Query.equal('categoryId', categoryType.toLowerCase())); // Corrected toLowercase() to toLowerCase()
    }
    if (startDate && endDate) {
      const formattedStartDate = new Date(startDate.split('/').reverse().join('-')).toISOString();
      const formattedEndDate = new Date(endDate.split('/').reverse().join('-')).toISOString();

      filters.push(Query.greaterThanEqual('date', formattedStartDate));
      filters.push(Query.lessThanEqual('date', formattedEndDate));
    }
    if (searchName) {
      filters.push(Query.search('name', searchName));
    }

    if (filters.length === 0) {
      console.warn("No filters applied, returning empty list.");
      return []; // Handle no filters scenario
    }

    if (sortBy) {
      sortOptions.push(sortBy.includes('Descending') ? Query.orderDesc(sortBy.replace('Descending', '')) : Query.orderAsc(sortBy.replace('Ascending', '')));
    }
console.log(sortOptions)
    const expenses = await databases.listDocuments(
      import.meta.env.VITE_DB_ID,
      import.meta.env.VITE_DB_EXPENSE_ID,
      filters,
      sortOptions
    );

    return expenses.documents;

  } catch (error) {
    console.error("Error listing filtered expenses:", error);
    throw error; 
  }
}


/* To add a new category */
export function addCategory(userId, userEmail, categoryData) {
  const { name, type, subCategories } = categoryData;
  return async function () {
    try {
      await databases.createDocument(
        import.meta.env.VITE_DB_ID, // Database ID
        import.meta.env.VITE_DB_CATEGORY_ID, // Category Collection ID
        ID.unique(), // Unique ID for the new document
        {
          name: name, // Category name
          userId: userId, // User ID reference
          userEmail: userEmail,
          type: type,
          subCategories: subCategories,
        }
      );
    } catch (error) {
      console.error("Error in addCategory:", error);
    }
  };
}

/* To edit an existing category name */
export function editCategoryName(categoryId, newCategoryName) {
  return function (dispatch) {
    const promise = databases.updateDocument(
      import.meta.env.VITE_DB_ID,
      import.meta.env.VITE_DB_CATEGORY_ID,
      categoryId,
      {
        name: newCategoryName,
      }
    );

    promise.then(
      (updatedCategoryDocument) => {
        const userId = updatedCategoryDocument.user.$id;
        setTimeout(() => dispatch(fetchData(userId)), 3000);
      },
      (error) => {
        console.log(error);
      }
    );
  };
}

/* To delete a category and all its related documents i.e. expenses and its reference in user collection */
export function deleteCategory(userId, categoryId) {
  return function () {
    const promise = databases.deleteDocument(
      import.meta.env.VITE_DB_ID,
      import.meta.env.VITE_DB_CATEGORY_ID,
      categoryId
    );

    promise.then(() => {
      console.log("Deleted");
    }).catch((error) => {
      console.log(error);
    });
  };
}

/* To add an expense to a particular category (also updates the totalAmount of that category and fetch the updated data into the state) */
export function addExpense(
  userEmail,
  categoryId,
  expenseDetails,
) {
  return async function () {
    try {
      const { amount, name, description, date, amountType } = expenseDetails;
      const expenseData = {
        amount: parseFloat(amount), // Ensure type matches Appwrite schema
        name: name,
        description: description,
        date: date,
        amountType: amountType,
        categoryId: categoryId,
        userEmail: userEmail,
      };
      await databases.createDocument(
        import.meta.env.VITE_DB_ID,
        import.meta.env.VITE_DB_EXPENSE_ID,
        ID.unique(),
        expenseData
      );
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };
}

/* To edit an expense details (also updates the corresponding category's totalAmount and fetches the updated data into the state) */
export function editExpense(expenseId, expenseDetails) {
  return function () {
    // updating the expense document
    const promise = databases.updateDocument(
      import.meta.env.VITE_DB_ID,
      import.meta.env.VITE_DB_EXPENSE_ID,
      expenseId,
      {
        ...expenseDetails,
      }
    );
    return promise;
  };
}

/* To delete an expense (also fetches the updated data into the state) */
export function removeExpense(expenseId) {
  return function () {

    // deleting an expense document
    const promise = databases.deleteDocument(
      import.meta.env.VITE_DB_ID,
      import.meta.env.VITE_DB_EXPENSE_ID,
      expenseId
    );

    promise.then(() => {
      console.log("Expense deleted successfully");
    }).catch((error) => {
      console.error("Error deleting expense:", error);
    });
  };
}
