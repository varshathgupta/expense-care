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
  const account = new sdk.Account(client);
  const avatars = new sdk.Avatars(client);
  const database = new sdk.Databases(client);
  const functions = new sdk.Functions(client);
  const health = new sdk.Health(client);
  const locale = new sdk.Locale(client);
  const storage = new sdk.Storage(client);
  const teams = new sdk.Teams(client);
  const users = new sdk.Users(client);

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

    const data = JSON.parse(req.payload);

    const categoryId = data?.categoryId;

    const promise = database.getDocument(
      req.variables["APPWRITE_DB_ID"],
      req.variables["APPWRITE_DB_CATEGORY_ID"],
      categoryId
    );

    const date = new Date();
    const currYear = date.getFullYear();
    const currMonth = date.getMonth();

    let updatedCurrYearExpense = 0;
    let updatedCurrMonthExpense = 0;

    promise.then(
      (categoryDocument) => {
        const expenses = categoryDocument.expenses;

        expenses.forEach((expense) => {
          if (expense.year == currYear) {
            updatedCurrYearExpense += parseInt(expense.amount);

            if (expense.month == currMonth)
              updatedCurrMonthExpense += parseInt(expense.amount);
          }
        });

        const promise = database.updateDocument(
          req.variables["APPWRITE_DB_ID"],
          req.variables["APPWRITE_CATEGORY_ID"],
          categoryId,
          {
            currYearExpense: updatedCurrYearExpense,
            currMonthExpense: updatedCurrMonthExpense,
          }
        );

        promise.then(
          (updatedCategoryDocument) => res.json({ updatedCategoryDocument }),
          (error) => res.json({ error })
        );
      },
      (error) => res.json({ error })
    );
  }
};
