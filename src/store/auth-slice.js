import { createSlice } from "@reduxjs/toolkit";
import { account, functions } from "../appwrite/appwrite-config";
import { loadingActions } from "./loading-slice";


const initialState = {
  userId: null,
  sessionId: null,
  userEmail: null,
  googleSession: false,
};

/* State to provide and set the logged in user's userId and email */

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUserData(state, action) {
      state.userId = action.payload?.userId;
      state.sessionId = action.payload?.sessionId;
      state.userEmail = action.payload?.userEmail;
      state.googleSession = action.payload?.googleSession;
    },
    setUserId(state, action) {
      state.userId = action?.payload;
    },
    setUserEmail(state, action) {
      state.userEmail = action?.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;

export function logout(sessionId, userId) {
  return function (dispatch) {
    if (sessionId) {
      const promise = account.deleteSession(sessionId);

      promise.then(
        (response) => {
          console.log(response);
          dispatch(authActions.setUserData(initialState));
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
  return function (dispatch) {
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
