import { useEffect, useState } from "react";
import Header from "../components/Header";
import ExpensesTable from "../components/table/ExpensesTable";
import Filters from "../components/table/Filters";
import { fetchData, listFilteredExpenses } from "../store/data-actions";
import { Flex, Text } from "@chakra-ui/react";

function AllExpenses() {
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showAllColumns, setShowAllColumns] = useState(true);
  const [searchElements, setSearchElements] = useState({
    startDate: "",
    endDate: "",
    search: "",
    categoryId: "",
  });

  useEffect(() => {
    if (
      !searchElements.startDate &&
      !searchElements.endDate &&
      !searchElements.categoryId &&
      !searchElements.search
    ) {
      fetchData()
        .then((data) => {
          setFilteredExpenses(data.expenses);
        })
        .catch((error) => {
          console.error("Error fetching initial expenses:", error);
        });
    }
  }, [filteredExpenses.length, searchElements]);

  // Fetch filtered expenses when search elements change
  useEffect(() => {
    if (searchElements.startDate && searchElements.endDate) {
      fetchDateFilteredExpenses(
        searchElements.startDate,
        searchElements.endDate
      );
    }
  }, [searchElements.startDate, searchElements.endDate]);
  useEffect(() => {
    if (searchElements.categoryId) {
      fetchCategoryFilteredExpenses(searchElements.categoryId);
    }
  }, [searchElements.categoryId]);

  // Fetch filtered expenses function
  const fetchDateFilteredExpenses = async (startDate, endDate) => {
    try {
      const data = await listFilteredExpenses(null, startDate, endDate, null);
      setFilteredExpenses(data.length > 0 ? data : []); // Ensure fallback to an empty array
    } catch (error) {
      console.error("Error fetching filtered expenses:", error);
    }
  };
  const fetchCategoryFilteredExpenses = async (categoryId) => {
    try {
      const data = await listFilteredExpenses(categoryId, null, null, null);
      setFilteredExpenses(data.length > 0 ? data : []); // Ensure fallback to an empty array
    } catch (error) {
      console.error("Error fetching filtered expenses:", error);
    }
  };

  return (
    <>
      <Header />
      <Filters
        setSearchElements={setSearchElements}
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
          showAllColumns={showAllColumns}
        />
      )}
    </>
  );
}

export default AllExpenses;
