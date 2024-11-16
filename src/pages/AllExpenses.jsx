import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ExpensesTable from "../components/table/ExpensesTable";
import Filters from "../components/table/Filters";
import { useSelector } from "react-redux";


function AllExpenses() {
 // const expenses = useSelector((state) => state.filter.filteredExpenses);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
const expenses = useSelector((state) => state.data.expenses);
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);

  const [showAllColumns, setShowAllColumns] = useState(true);

  useEffect(() => {
    const handleWindowWidth = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setShowAllColumns(true);
      }
    };

    window.addEventListener("resize", handleWindowWidth);

    return () => {
      window.removeEventListener("resize", handleWindowWidth);
    };
  }, []);

  useEffect(() => {
    setFilteredExpenses(expenses);
  }, [expenses]);
  return (
    <>
      <Header />
      <Filters
        setFilteredExpenses={setFilteredExpenses}
        windowWidth={windowWidth}
        setShowAllColumns={setShowAllColumns}
        showAllColumns={showAllColumns}
      />
      <ExpensesTable
        filteredExpenses={filteredExpenses}
        windowWidth={windowWidth}
        showAllColumns={showAllColumns}
      />
    </>
  );
}

export default AllExpenses;
