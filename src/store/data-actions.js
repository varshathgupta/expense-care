import { ID, Query } from "appwrite";
import { databases } from "../appwrite/appwrite-config";


export async function fetchData(year, month) {
  const categoriesList = [];
  let startDate, endDate;
  const monthNames = {
    January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
    July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
};

if ( year < 1970 || year > 9999) {
    throw new Error("Invalid year value");
}

if (month !== undefined && month !== null) {
    if (typeof month === 'string') {
        month = monthNames[month];
    }
    if (typeof month !== 'number' || month < 1 || month > 12) {
        throw new Error("Invalid month value");
    }
}
if ((month === undefined || month === null)&& typeof year !== 'number') {
  startDate = new Date(Date.UTC(year.split('-')[0], 3, 1)); // Start of the financial year (April 1, 2024)
  endDate = new Date(Date.UTC(year.split('-')[1], 2, 31, 23, 59, 59)); // End of the financial year (March 31, 2025)
} else {
  startDate = new Date(Date.UTC(year, month - 1, 1)); // Start of the month in UTC to avoid timezone issues
  endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59)); // Last day of the month (23:59:59 UTC)
}
  try {
    // Fetch categories and expenses in parallel
    const [categories, expenses] = await Promise.all([
      databases.listDocuments(
        import.meta.env.VITE_DB_ID,
        import.meta.env.VITE_DB_CATEGORY_ID
      ),
      databases.listDocuments(
        import.meta.env.VITE_DB_ID, 
        import.meta.env.VITE_DB_EXPENSE_ID,
        [
          Query.greaterThanEqual("date", startDate.toISOString()), // Filter dates >= startDate
          Query.lessThanEqual("date", endDate.toISOString()),  
          Query.limit(7000), 
        ]
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
    throw error; 
  }
}

/* To list expenses based on filtered items (category type, year, month, and name) */
export async function listFilteredExpenses(categoryType = null, startDate = null, endDate = null, search = null, sortBy = null) {

  try {
    const filters = [];
    const sortOptions = [];
filters.push( Query.limit(1000), )
    if (categoryType) {
      filters.push(Query.equal('categoryId', categoryType.toLowerCase())); // Corrected toLowercase() to toLowerCase()
    }
    if (startDate && endDate) {
      const formattedStartDate = new Date(startDate.split('/').reverse().join('-')).toISOString();
      const formattedEndDate = new Date(endDate.split('/').reverse().join('-')).toISOString();

      filters.push(Query.greaterThanEqual('date', formattedStartDate));
      filters.push(Query.lessThanEqual('date', formattedEndDate));
    }
    if (search) {
      filters.push(Query.startsWith('name', search));
    }
    if (sortBy) {
      sortOptions.push(sortBy.includes('Descending') ? Query.orderDesc(sortBy.replace('Descending', '')) : Query.orderAsc(sortBy.replace('Ascending', '')));
    }
   

    const expenses =    
    (filters.length > 0 && sortOptions.length > 0)
      ? await databases.listDocuments(
          import.meta.env.VITE_DB_ID,
          import.meta.env.VITE_DB_EXPENSE_ID,
          filters,
          sortOptions
        )
      : (filters.length === 0 && sortOptions.length > 0)
      ? await databases.listDocuments(
          import.meta.env.VITE_DB_ID,
          import.meta.env.VITE_DB_EXPENSE_ID,
          sortOptions
        )
      : await databases.listDocuments(
          import.meta.env.VITE_DB_ID,
          import.meta.env.VITE_DB_EXPENSE_ID,
          filters
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
