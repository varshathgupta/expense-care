import { useEffect, useState } from "react";
import Header from "../components/Header";
import ExpensesTable from "../components/table/ExpensesTable";
import Filters from "../components/table/Filters";
import { fetchData, listFilteredExpenses } from "../store/data-actions";
import { Flex, Text, useToast } from "@chakra-ui/react";
import TransactionsPDF from "../components/table/TransactionsPDF";
import Loading from "../components/utility/Loading";

function AllTransactions() {
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showAllColumns, setShowAllColumns] = useState(true);
  const [searchElements, setSearchElements] = useState({
    startDate: "",
    endDate: "",
    search: "",
    categoryId: "",
    sortBy:''
  });
  const[loading,setLoading]=useState(false);
  const toast = useToast();

  useEffect(() => {
    if (
      !searchElements.startDate &&
      !searchElements.endDate &&
      !searchElements.categoryId &&
      !searchElements.search &&
      !searchElements.sortBy
    ) {
      setLoading(true)
      fetchData(new Date().getFullYear(), new Date().toLocaleString('default', { month: 'long' }))
        .then((data) => {
          setFilteredExpenses(data.expenses);
          setLoading(false)
        })
        .catch((error) => {
          toast({
            title: "Error fetching initial expenses:",
            description: error,
            status: "error",
            colorScheme: "red",
          });
          setLoading(false)
        });
    }
  }, [filteredExpenses.length, searchElements]);

  // Fetch filtered expenses when search elements change
  useEffect(() => {
    if (searchElements.startDate && searchElements.endDate) {
      localStorage.setItem('searchStartDate', searchElements.startDate)
      fetchDateFilteredExpenses(
        searchElements.startDate,
        searchElements.endDate
      );
    }else{
      localStorage.removeItem('searchStartDate')
    }
  }, [searchElements.startDate, searchElements.endDate]);
  useEffect(() => {
    if (searchElements.categoryId) {
      fetchCategoryFilteredExpenses(searchElements.categoryId);
    }
  }, [searchElements.categoryId]);
  useEffect(()=>{
    if(searchElements.search){
      fetchSearchFilteredExpenses(searchElements.search)
    }
    
  },[searchElements.search])
  useEffect(()=>{
    if(searchElements.sortBy){
      sortFilteredExpense(searchElements.sortBy)
    }
  },[searchElements.sortBy])

  // Fetch filtered expenses function
  const fetchDateFilteredExpenses = async (startDate, endDate) => {
    setLoading(true)
    try {
      const data = await listFilteredExpenses(null, startDate, endDate, null);
      setFilteredExpenses(data.length > 0 ? data : []); // Ensure fallback to an empty array
      setLoading(false)
    } catch (error) {
      toast({
        title: "Error fetching filtered expenses:",
        description: error,
        status: "error",
        colorScheme: "red",
      });
      setLoading(false)
    }
  };
  const fetchCategoryFilteredExpenses = async (categoryId) => {
    setLoading(true)
    try {
      const data = await listFilteredExpenses(categoryId, null, null, null);
      setFilteredExpenses(data.length > 0 ? data : []); // Ensure fallback to an empty array
      setLoading(false)
    } catch (error) {
      toast({
        title: "Error fetching filtered expenses:",
        description: error,
        status: "error",
        colorScheme: "red",
      });
      setLoading(false)
    }
  };
  const fetchSearchFilteredExpenses= async(search)=>{
    setLoading(true)
    try {
      const data = await listFilteredExpenses(null, null, null, search,);
      setFilteredExpenses(data.length > 0 ? data : []); // Ensure fallback to an empty array
      setLoading(false)
    } catch (error) {
      toast({
        title: "Error fetching filtered expenses:",
        description: error,
        status: "error",
        colorScheme: "red",
      });
      setLoading(false)
    }
  }
  const sortFilteredExpense= async(sortBy)=>{
    setLoading(true)
    try {
      const data = await listFilteredExpenses(null, null, null, null,sortBy);
      setFilteredExpenses(data.length > 0 ? data : []); // Ensure fallback to an empty array
      setLoading(false)
    } catch (error) {
      toast({
        title: "Error fetching filtered expenses:",
        description: error,
        status: "error",
        colorScheme: "red",
      });
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      {
        loading ?(
          <Loading />
        ):(
          <>
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
          <Text>No Data</Text>
        </Flex>
      ) : (
        <>
        <TransactionsPDF  filteredTransactions={filteredExpenses} />
        <ExpensesTable
          filteredExpenses={filteredExpenses}
          showAllColumns={showAllColumns}
        />
        </>
        
      )}
          </>
        )
      }

    </>
  );
}

export default AllTransactions;
