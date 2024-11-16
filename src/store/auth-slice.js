
import { account, functions } from "../appwrite/appwrite-config";
import { loadingActions } from "./loading-slice";


export function logout(sessionId, userId) {
  console.log(sessionId, userId);
  return function (dispatch) {
    if (sessionId) {
      const promise = account.deleteSession(sessionId);

      promise.then(
        () => {
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userId");
          localStorage.removeItem("sessionId");
          dispatch(loadingActions.setLoading(false));
        },
        (error) => {
          console.log(error);
          dispatch(loadingActions.setLoading(false));
        }
      );
    } else if (userId) {
      account.deleteSessions(userId);
    }
  };
}

export function updateCurrYearAndMonth(userId) {
  return function () {
    const promise = functions.createExecution(
      import.meta.env.VITE_FUNCTION_UPDATE_YEAR_AND_MONTH_ID,
      JSON.stringify({
        userId: userId,
      })
    );

    promise.then(
      (response) => {},
      (error) => console.log(error)
    );
  };
}


