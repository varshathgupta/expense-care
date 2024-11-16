import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ExpensesTable from "../components/table/ExpensesTable";
import Filters from "../components/table/Filters";
import { useSelector } from "react-redux";
import { fetchData } from "../store/data-actions";
import { Flex, Text } from "@chakra-ui/react";


function AllExpenses() {
 // const expenses = useSelector((state) => state.filter.filteredExpenses);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const [showAllColumns, setShowAllColumns] = useState(true);

  useEffect(() => {

    // };
    fetchData().then(data => {
      console.log(data);
      setFilteredExpenses(data.expenses);
    }).catch(error => {
      console.error("Error fetching expenses:", error);
    });
  }, []);

  return (
    <>
      <Header />
      <Filters
        setFilteredExpenses={setFilteredExpenses}
        windowWidth={windowWidth}
        setShowAllColumns={setShowAllColumns}
        showAllColumns={showAllColumns}
      />
      {filteredExpenses.length === 0 ? (
        <Flex
          bgColor={"lightgray"}
          justifyContent={"center"}
          alignItems={"center"}
          p={5}
          w={"90vw"}
          mx={"auto"}
        >
          <Text>Loading expenses...</Text>
        </Flex>
      ) : (
        <ExpensesTable
          filteredExpenses={filteredExpenses}
          windowWidth={windowWidth}
          showAllColumns={showAllColumns}
        />
      )}
    </>
  );
}

export default AllExpenses;
