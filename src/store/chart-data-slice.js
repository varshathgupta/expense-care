import { createSlice } from "@reduxjs/toolkit";
import { account, databases } from "../appwrite/appwrite-config";
import { Query } from "appwrite";
import { loadingActions } from "./loading-slice";
// import { months } from "../components/table/Filters";

const initialState = {
  data: [],
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  // monthName: months.find((month) => month.value === new Date().getMonth())
  //   .option,
};

const chartDataSlice = createSlice({
  name: "chartData",
  initialState: initialState,
  reducers: {
    setChartData(state, action) {
      state.data = action.payload;
    },
    setChartInputs(state, action) {
      state.year = action.payload.year;
      state.month = action.payload.month;
    },
  },
});

export const chartDataActions = chartDataSlice.actions;

export default chartDataSlice.reducer;

// Function to fetch the data as per filters on chart page

export function updateChartData({ year, month }) {
  return function (dispatch) {
    account.get().then(
      (user) => {
        const userId = user.$id;

        // expenses that are equal to the filter year and month
        databases
          .listDocuments(
            import.meta.env.VITE_DB_ID,
            import.meta.env.VITE_DB_EXPENSE_ID,
            [
              Query.equal("userId", userId),
              Query.equal("year", year),
              Query.equal("month", month),
            ]
          )
          .then(
            (response) => {
              const expenses = response.documents;
              const data = new Map();

              //   summing up the amount of every category
              expenses.forEach((expense) => {
                const categoryName = expense.categoryName;
                const amount = parseInt(expense.amount);
                if (data.has(categoryName)) {
                  data.set(categoryName, data.get(categoryName) + amount);
                } else {
                  data.set(categoryName, amount);
                }
              });

              const chartData = [];

              //   making an array of required data to form charts

              data.forEach((value, categoryName) => {
                chartData.push({ categoryName: categoryName, expense: value });
              });

              dispatch(chartDataActions.setChartData(chartData));
              dispatch(loadingActions.setLoading(false));
            },
            (error) => {
              console.log(error);
              dispatch(loadingActions.setLoading(false));
            }
          );
      },
      (error) => {
        console.log(error);
        dispatch(loadingActions.setLoading(false));
      }
    );
  };
}
