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

  const { userId } = JSON.parse(req?.payload);

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

    const [currYear, currMonth] = [
      new Date().getFullYear(),
      new Date().getMonth(),
    ];

    function updateUserDocument(action) {
      if (action === "updateYearAndMonth") {
        const promise = database.updateDocument(
          req.variables["APPWRITE_DB_ID"],
          req.variables["APPWRITE_DB_USER_ID"],
          userId,
          {
            currYear,
            currMonth,
            currYearExpense: 0,
            currMonthExpense: 0,
          }
        );

        promise.then(
          () => {},
          (error) => res.json({ error })
        );
      } else if (action === "updateMonth") {
        const promise = database.updateDocument(
          req.variables["APPWRITE_DB_ID"],
          req.variables["APPWRITE_DB_USER_ID"],
          userId,
          {
            currMonth,
            currMonthExpense: 0,
          }
        );

        promise.then(
          () => {},
          (error) => res.json({ error })
        );
      }
    }

    const promise = database.getDocument(
      req.variables["APPWRITE_DB_ID"],
      req.variables["APPWRITE_DB_USER_ID"],
      userId
    );

    promise.then((userDocument) => {
      if (currYear !== parseInt(userDocument.currYear)) {
        const categories = userDocument.categories;

        categories.forEach((category) => {
          const promise = database.updateDocument(
            req.variables["APPWRITE_DB_ID"],
            req.variables["APPWRITE_DB_CATEGORY_ID"],
            category.$id,
            {
              currYearExpense: 0,
              currMonthExpense: 0,
            }
          );
          promise.then(
            () => {
              updateUserDocument("updateYearAndMonth");
            },
            (error) => res.json({ error })
          );
        });
      } else if (
        currYear === parseInt(userDocument.currYear) &&
        currMonth !== parseInt(userDocument.currMonth)
      ) {
        const categories = userDocument.categories;

        categories.forEach((category) => {
          const promise = database.updateDocument(
            req.variables["APPWRITE_DB_ID"],
            req.variables["APPWRITE_DB_CATEGORY_ID"],
            category.$id,
            {
              currMonthExpense: 0,
            }
          );
          promise.then(
            () => {
              updateUserDocument("updateMonth");
            },
            (error) => res.json({ error })
          );
        });
      }
    });
  }
};
