import { createSlice } from "@reduxjs/toolkit";

// Initial state for expense data
const expenseInitialState = {
  categories: [],
  expenses: [],
  // userCurrYearExpense: null,
  // userCurrMonthExpense: null,
};

// Initial state for display preferences
const displayInitialState = {
  yearlyExpensesOnCard: false
};

/* State to provide and set the updated categories and expenses data */
const expenseSlice = createSlice({
  name: "expenseData",
  initialState: expenseInitialState,
  reducers: {
    /* sets the fetched data received in payload to the state */
    setData(state, action) {
      const { categories, expenses} = action.payload || {};
      
      return {
        ...state,
        categories: categories || [],
        expenses: expenses || [],
        // userCurrYearExpense: currYearExpense || 0,
        // userCurrMonthExpense: currMonthExpense || 0
      };
    }
  }
});

/* State to manage display preferences */
const displaySlice = createSlice({
  name: "displayPreferences", 
  initialState: displayInitialState,
  reducers: {
    setYearlyExpensesOnCard(state, action) {
      return {
        ...state,
        yearlyExpensesOnCard: action.payload
      };
    }
  }
});

export const expenseActions = expenseSlice.actions;
export const displayActions = displaySlice.actions;

export const expenseReducer = expenseSlice.reducer;
export const displayReducer = displaySlice.reducer;
