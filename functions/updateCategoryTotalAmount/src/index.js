const sdk = require("node-appwrite");

/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - request body data as a string
    'variables' - object with function variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
*/

module.exports = async function (req, res) {
  const client = new sdk.Client();

  // You can remove services you don't use
  const database = new sdk.Databases(client);

  const data = JSON.parse(req.payload);

  // const { categoryId, userId } = JSON.parse(req.payload);

  if (
    !req.variables["APPWRITE_FUNCTION_ENDPOINT"] ||
    !req.variables["APPWRITE_FUNCTION_API_KEY"]
  ) {
    console.warn(
      "Environment variables are not set. Function cannot use Appwrite SDK."
    );
  } else {
    client
      .setEndpoint(req.variables["APPWRITE_FUNCTION_ENDPOINT"])
      .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
      .setKey(req.variables["APPWRITE_FUNCTION_API_KEY"])
      .setSelfSigned(true);

    const { action, categoryId } = data;

    const promise = database.getDocument(
      req.variables["APPWRITE_DB_ID"],
      req.variables["APPWRITE_DB_CATEGORY_ID"],
      categoryId
    );

    promise.then(
      (categoryDocument) => {
        const { currYearExpense, currMonthExpense } = categoryDocument;
        let [updatedCurrYearExpense, updatedCurrMonthExpense] = [
          currYearExpense,
          currMonthExpense,
        ];
        let { amount } = data;
        amount = parseInt(amount);

        if (action === "ON_ADD_EXPENSE") {
          updatedCurrYearExpense += amount;
          updatedCurrMonthExpense += amount;
        } else if (action === "ON_REMOVE_EXPENSE") {
          const { updateYearAmount, updateMonthAmount } = data;
          if (updateYearAmount) updatedCurrYearExpense -= amount;
          if (updateMonthAmount) updatedCurrMonthExpense -= amount;
        } else if (action === "ON_EDIT_EXPENSE") {
          const { editedAmount, updateYearAmount, updateMonthAmount } = data;
          if (updateYearAmount) updatedCurrYearExpense += editedAmount - amount;
          if (updateMonthAmount)
            updatedCurrMonthExpense += editedAmount - amount;
        }

        const promise = database.updateDocument(
          req.variables["APPWRITE_DB_ID"],
          req.variables["APPWRITE_DB_CATEGORY_ID"],
          categoryId,
          {
            currYearExpense: updatedCurrYearExpense,
            currMonthExpense: updatedCurrMonthExpense,
          }
        );

        promise.then(
          (updatedDocument) => {
            return res.json(updatedDocument);
          },
          (error) => {
            return res.json({ error });
          }
        );
      },
      (error) => {
        return res.json({ error });
      }
    );

    // const date = new Date();
    // const currYear = parseInt(date.getFullYear());
    // const currMonth = parseInt(date.getMonth());

    // database
    //   .getDocument(
    //     req.variables["APPWRITE_DB_ID"],
    //     req.variables["APPWRITE_DB_CATEGORY_ID"],
    //     categoryId
    //   )
    //   .then(
    //     (response) => {
    //       const currExpenses = response.expenses;
    //       let updatedCurrYearExpense = 0;
    //       let updatedCurrMonthExpense = 0;

    //       currExpenses.forEach((expense) => {
    //         if (currYear == expense.year) {
    //           updatedCurrYearExpense += expense.amount;

    //           if (currMonth === expense.month)
    //             updatedCurrMonthExpense += expense.amount;
    //         }
    //       });

    //       database
    //         .updateDocument(
    //           req.variables["APPWRITE_DB_ID"],
    //           req.variables["APPWRITE_DB_CATEGORY_ID"],
    //           categoryId,
    //           {
    //             currYearExpense: updatedCurrYearExpense,
    //             currMonthExpense: updatedCurrMonthExpense,
    //           }
    //         )
    //         .then(
    //           (response) => {
    //             return res.json(response);
    //           },
    //           (error) => {
    //             return res.json({ error });
    //           }
    //         );
    //     },
    //     (error) => {
    //       return res.json({ error });
    //     }
    //   );
  }
};
