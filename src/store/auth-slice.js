
import { account } from "../appwrite/appwrite-config";
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



