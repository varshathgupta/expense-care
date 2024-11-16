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
import AddCategoryButton from "../components/dashboard/AddCategoryButton";
import { useEffect, useState, useCallback } from "react";
import { fetchData } from "../store/data-actions";

function Dashboard() {
  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState({});
  const [showYearlyExpenses, setShowYearlyExpenses] = useState(false);

  const { isOpen, onToggle, onClose } = useDisclosure();
  const { isOpen: isOpenRight, onClose: onCloseRight } = useDisclosure();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const data = await fetchData();
      if (data) {
        setExpenseData(data.expenses || []);
        const incomeCategories = data.categories?.filter(cat => cat.type === 'income') || [];
        const expenseCategories = data.categories?.filter(cat => cat.type === 'expense') || [];
        setCategories({ income: incomeCategories, expense: expenseCategories });
      }
    };
    fetchDashboardData();
  }, []);

  const calculateTotal = useCallback((categoryId, isYearly = false) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return expenseData.reduce((accumulator, expense) => {
      const expenseDate = new Date(expense.date);
      const isMatchingCategory = (categoryId === 'monthly' || categoryId === 'yearly') ? true : expense.categoryId.toLowerCase() === categoryId.toLowerCase();
      const isYearlyMatch = isYearly && expenseDate.getFullYear() === currentYear;
      const isMonthlyMatch = !isYearly && expenseDate.getMonth() === currentMonth;

      // Adjusting the logic to ensure yearly calculation works correctly
      return accumulator + (isMatchingCategory && (isYearly ? isYearlyMatch : isMonthlyMatch) ? (expense.amount || 0) : 0);
    }, 0);
  }, [expenseData]);
  
  const userCurrYearExpense = calculateTotal('yearly', true);
  const userCurrMonthExpense = calculateTotal('monthly', false);

  return (
    <Flex flexDir="column" gap={2} w="100vw" justifyContent="center">
      <Header />
      <TotalExpenseCard
        userCurrYearExpense={userCurrYearExpense}
        userCurrMonthExpense={userCurrMonthExpense}
      />
      <Text textColor="whiteAlpha.700" fontStyle="italic" textAlign="center" mt={2}>
        Cards are showing current {showYearlyExpenses ? "year's" : "month's"} expenses
      </Text>
      <Box>
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <Box>
            <Text fontSize="2xl" padding={5} mb={4} color="whiteAlpha.900">Income Categories</Text>
            <Flex flexWrap="wrap" gap={10} px={10} py={5}>
              {categories.income?.map(category => (
                <ExpenseCard key={category.$id} category={{ ...category, total: calculateTotal(category.name, showYearlyExpenses) }} />
              ))}
            </Flex>
          </Box>
          <Box gridColumn="span 2">
            <Text fontSize="2xl" padding={5} mb={4} color="whiteAlpha.900">Expense Categories</Text>
            <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={20} px={10} py={5}>
              {categories.expense?.length ? (
                categories.expense.map(category => (
                  <ExpenseCard key={category.$id} category={{ ...category, total: calculateTotal(category.name, showYearlyExpenses) }} />
                ))
              ) : (
                <Text color="whiteAlpha.700">Loading...</Text>
              )}
            </Grid>
          </Box>
        </Grid>
      </Box>
      <Popover placement="top-end" closeOnBlur closeOnEsc onClose={onClose} isOpen={isOpen}>
        <PopoverTrigger>
          <Button position="fixed" bottom="1rem" left="1rem" colorScheme="pink" h="4rem" w="4rem" rounded="full" onClick={onToggle}>
            <SlidersHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent bgColor="lightgray">
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader textAlign="center">Show Card Expenses</PopoverHeader>
            <PopoverBody display="flex" flexDir="column" gap={1}>
              <Button
                w="100%"
                bgColor={showYearlyExpenses ? "pink.500" : "inherit"}
                _hover={{ bgColor: "pink.600" }}
                _active={{ bgColor: "pink.600" }}
                onClick={() => {
                  setShowYearlyExpenses(true);
                  onToggle();
                }}
              >
                Yearly
              </Button>
              <Button
                w="100%"
                bgColor={showYearlyExpenses ? "inherit" : "pink.500"}
                _hover={{ bgColor: "pink.600" }}
                _active={{ bgColor: "pink.600" }}
                onClick={() => {
                  setShowYearlyExpenses(false);
                  onToggle();
                }}
              >
                Monthly
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
      <Popover placement="top-end" closeOnBlur closeOnEsc onClose={onCloseRight} isOpen={isOpenRight}>
        <PopoverTrigger>
          <AddCategoryButton />
        </PopoverTrigger>
      </Popover>
    </Flex>
  );
}

export default Dashboard;
