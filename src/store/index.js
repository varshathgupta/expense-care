import { configureStore } from "@reduxjs/toolkit";
import {displayReducer, expenseReducer} from "./data-slice";
import chartDataReducer from "./chart-data-slice";
import loadingReducer from "./loading-slice";

/*
reducer:
  auth - logged in user's userId and email
  filter - filter values to filter data on the all expenses page
  data - updated categories and expenses data
*/

const store = configureStore({
  reducer: {
    data: expenseReducer,
    displayPreferences: displayReducer,
    chartData: chartDataReducer,
    loading: loadingReducer,
  },
});

export default store;
