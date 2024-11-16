// import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  Box,
  Button,
  Flex,
  Grid,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import ExpenseCard from "../components/dashboard/ExpenseCard";
import TotalExpenseCard from "../components/dashboard/TotalExpenseCard";
import { SlidersHorizontalIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import AddCategoryButton from "../components/dashboard/AddCategoryButton";
import { displayActions } from "../store/data-slice";
import { useEffect, useState } from "react";
import { fetchData } from "../store/data-actions";



// export const categories = [
//   { name: "RECEIPTS", currMonthExpense: 4000, id: "receipts"},
//   { name: "CONTRA", currMonthExpense: 4000, id: "contra"},
//   { name: "PAYMENTS", currMonthExpense: 15000, id:'payments' },
//   { name: "VBS", currMonthExpense: 37000, id:'vbs' },
//   { name: "CHRISTMAS & NEW YEAR", currMonthExpense: 1000 , id :'christmas'},
//   { name: "WMT & OBLATION", currMonthExpense: 2000 , id:'wmt'},
//   { name: "TRANSPORT", currMonthExpense: 2000 , id:'transport'},
// ];
// export const categories = [];

function Dashboard() {
  const dispatch = useDispatch();
 const[expenseData,setExpenseData] = useState({});
 const [categories,setCategories] = useState({});

  
  const showYearlyExpenses = useSelector(
    (state) => state.displayPreferences
  );
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { isOpen: isOpenRight, onClose: onCloseRight } = useDisclosure();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData =async()=>{
    const data = await fetchData();
    if(data?.expenses){
      setExpenseData(data?.expenses);
    }
    if(data?.categories){
      const incomeCategories = data.categories.filter(cat => cat.type === 'income');
      const expenseCategories = data.categories.filter(cat => cat.type === 'expense');
      setCategories({income: incomeCategories, expense: expenseCategories});
   }
  }
  useEffect(()=>{
    console.log(categories);
  },[categories])

  return (
    <Flex flexDir={"column"} gap={2} w={"100vw"} justifyContent={"center"}>
      <Header />
      {/* <TotalExpenseCard
        userCurrYearExpense={userCurrYearExpense}
        userCurrMonthExpense={userCurrMonthExpense}
      /> */}
       <TotalExpenseCard
        userCurrYearExpense={1000345}
        userCurrMonthExpense={20567}
      />

      <Text
        textColor={"whiteAlpha.700"}
        fontStyle={"italic"}
        textAlign={"center"}
        mt={2}
      >
        Cards are showing current {showYearlyExpenses ? "year's" : "month's"}{" "}
        expenses
      </Text>
      <Box>
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <Box>
            <Text fontSize="2xl"  padding={5} mb={4} color="whiteAlpha.900">Income Categories</Text>
            <Flex
              flexWrap={"wrap"}
              gap={10}
              px={10}
              py={5}
            >
              {categories.income?.map((category) => (
                <ExpenseCard key={category.$id} category={category} />
              ))}
            </Flex>
          </Box>

          <Box gridColumn="span 2">
            <Text fontSize="2xl" padding={5} mb={4} color="whiteAlpha.900">Expense Categories</Text>
            <Grid
              templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
              gap={20}
              px={10}
              py={5}
            >
              {categories.expense?.map((category) => (
                <ExpenseCard key={category.$id} category={category} />
              ))}
            </Grid>
          </Box>
        </Grid>
      </Box>

      <Popover
        placement="top-end"
        closeOnBlur
        closeOnEsc
        onClose={onClose}
        isOpen={isOpen}
      >
        <PopoverTrigger>
          <Button
            position={"fixed"}
            bottom={"1rem"}
            left={"1rem"}
            colorScheme="pink"
            h={"4rem"}
            w={"4rem"}
            rounded={"full"}
            onClick={onToggle}
          >
            <SlidersHorizontalIcon />{" "}
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent bgColor={"lightgray"}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader textAlign={"center"}>
              Show Card Expenses
            </PopoverHeader>
            <PopoverBody display={"flex"} flexDir={"column"} gap={1}>
              <Button
                w={"100%"}
                bgColor={showYearlyExpenses ? "pink.500" : "inherit"}
                _hover={{ bgColor: "pink.600" }}
                _active={{ bgColor: "pink.600" }}
                onClick={() => {
                  dispatch(displayActions.setYearlyExpensesOnCard(true));
                  onToggle();
                }}
              >
                Yearly
              </Button>
              <Button
                w={"100%"}
                bgColor={showYearlyExpenses ? "inherit" : "pink.500"}
                _hover={{ bgColor: "pink.600" }}
                _active={{ bgColor: "pink.600" }}
                onClick={() => {
                  dispatch(displayActions.setYearlyExpensesOnCard(false));
                  onToggle();
                }}
              >
                Monthly
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>

      <Popover
        placement="top-end" 
        closeOnBlur
        closeOnEsc
        onClose={onCloseRight}
        isOpen={isOpenRight}
      >
        <PopoverTrigger>
         <AddCategoryButton />
        </PopoverTrigger>
       
      </Popover>
    </Flex>
  );
}

export default Dashboard;
