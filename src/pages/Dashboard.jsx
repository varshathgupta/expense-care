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
  useToast,
} from "@chakra-ui/react";
import ExpenseCard from "../components/dashboard/ExpenseCard";
import TotalExpenseCard from "../components/dashboard/TotalExpenseCard";
import { SlidersHorizontalIcon } from "lucide-react";
import AddCategoryButton from "../components/dashboard/AddCategoryButton";
import { useEffect, useState, useCallback } from "react";
import { fetchData } from "../store/data-actions";
import Loading from "../components/utility/Loading";

function Dashboard() {
  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState({});
  const [showYearlyExpenses, setShowYearlyExpenses] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { isOpen: isOpenRight, onClose: onCloseRight } = useDisclosure();

  useEffect(() => {
    
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const data = await fetchData();
    if (data) {
      setExpenseData(data.expenses || []);
      const incomeCategories = data.categories?.filter(cat => cat.type === 'income') || [];
      const expenseCategories = data.categories?.filter(cat => cat.type === 'expense') || [];
      setCategories({ income: incomeCategories, expense: expenseCategories });
      setLoading(false);
    }else{
      toast({
        title: "No data available",
        description: "Retry or contact admin",
        status: "error",
        colorScheme: "red",
      });
      setLoading(false);
    }
  };
  const calculateTotal = useCallback((categoryId, isYearly = false) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    if (categoryId === 'yearly' || categoryId === 'monthly') {
        return expenseData.reduce(
          (accumulator, expense) => {
              const expenseDate = new Date(expense.date);
              const isYearlyMatch = isYearly && expenseDate.getFullYear() === currentYear;
              const isMonthlyMatch =
                  !isYearly &&
                  expenseDate.getMonth() === currentMonth &&
                  expenseDate.getFullYear() === currentYear;
      
              if (isYearlyMatch || isMonthlyMatch) {
                  if (expense.amountType === 'income') {
                      accumulator.totalIncome += expense.amount || 0;
                  } else if (expense.amountType === 'expense') {
                      accumulator.totalExpense += expense.amount || 0;
                  }
      
                  // Update balance dynamically
                  accumulator.balance = accumulator.totalIncome - accumulator.totalExpense;
              }
      
              return accumulator;
          },
          { totalIncome: 0, totalExpense: 0, balance: 0 } // Initialize totals
      );
      
    }

    // Default behavior for other categories
    return expenseData.reduce((accumulator, expense) => {
        const expenseDate = new Date(expense.date);
        const isMatchingCategory =
            expense.categoryId.toLowerCase() === categoryId.toLowerCase();
        const isYearlyMatch = isYearly && expenseDate.getFullYear() === currentYear;
        const isMonthlyMatch =
            !isYearly &&
            expenseDate.getMonth() === currentMonth &&
            expenseDate.getFullYear() === currentYear;

        if (isMatchingCategory && (isYearlyMatch || isMonthlyMatch)) {
            accumulator += expense.amount || 0;
        }

        return accumulator;
    }, 0);
}, [expenseData]);



  return (
    <Flex flexDir="column" gap={2} w="100vw" justifyContent="center">
      <Header />
      <TotalExpenseCard
       data={calculateTotal(showYearlyExpenses ? 'yearly' : 'monthly',showYearlyExpenses)}
      />
      <Text textColor="whiteAlpha.700" fontStyle="italic" textAlign="center" mt={2}>
        Cards are showing current {showYearlyExpenses ? "year's" : "month's"} expenses
      </Text>
      {
        loading ? (
          <Loading />
        ):(
          <Box>
        <Grid 
  templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} 
  gap={4}
>
  {/* Income Categories */}
  <Box>
    <Text fontSize="2xl" padding={5} mb={4} color="whiteAlpha.900">
      Income Categories
    </Text>
    <Flex 
      flexWrap="wrap" 
      gap={4} 
      px={{ base: 5, md: 10 }} 
      py={5}
    >
      {categories.income?.length ? (
        categories.income.map(category => (
          <ExpenseCard 
            key={category.$id} 
            category={{ 
              ...category, 
              total: calculateTotal(category.name, showYearlyExpenses) 
            }} 
          />
        ))
      ) : (
        <Text color="whiteAlpha.700">No Income Categories</Text>
      )}
    </Flex>
  </Box>

  {/* Expense Categories */}
  <Box 
    gridColumn={{ base: "1 / -1", md: "span 2" }}
  >
    <Text fontSize="2xl" padding={5} mb={4} color="whiteAlpha.900">
      Expense Categories
    </Text>
    <Grid 
      templateColumns={{ base: "1fr", sm: "repeat(auto-fill, minmax(150px, 1fr))", md: "repeat(auto-fill, minmax(200px, 1fr))" }} 
      gap={10} 
      px={{ base: 5, md: 10 }} 
      py={5}
    >
      {categories.expense?.length ? (
        categories.expense.map(category => (
          <ExpenseCard 
            key={category.$id} 
            category={{ 
              ...category, 
              total: calculateTotal(category.name, showYearlyExpenses) 
            }} 
          />
        ))
      ) : (
        <Text color="whiteAlpha.700">No Expense Categories</Text>
      )}
    </Grid>
  </Box>
</Grid>

        </Box>
        )
      }
    {
      !loading && (
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
      )
    }
     
      <Popover placement="top-end" closeOnBlur closeOnEsc onClose={onCloseRight} isOpen={isOpenRight}>
        <PopoverTrigger>
          <AddCategoryButton />
        </PopoverTrigger>
      </Popover>
    </Flex>
  );
}

export default Dashboard;
