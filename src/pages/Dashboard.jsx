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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { isOpen: isOpenRight, onClose: onCloseRight } = useDisclosure();
  const userId = localStorage.getItem("userId");
  const months =["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const currentMonth = new Date().getMonth();
  const currentFinancialYear = getCurrentFinancialYear();
  const previousFinancialYear = getPreviousFinancialYear()

  useEffect(() => {
   if(showYearlyExpenses){
    console.log("Selected Year: ", selectedYear);
    fetchDashboardData(selectedYear, null)
   }else{
    fetchDashboardData(selectedYear, selectedMonth)
   }
  }, [showYearlyExpenses,selectedYear, selectedMonth]);

  const fetchDashboardData = async (year, month) => {
    setLoading(true);
    const data = await fetchData(year, month);
    console.log("Data: ", data);
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
  const calculateTotal = useCallback((categoryId,) => {

    if (categoryId === 'yearly' || categoryId === 'monthly') {
        return expenseData.reduce(
          (accumulator, expense) => {
            console.log("Expense: ", expense);
            if (expense.amountType === 'income') {
              accumulator.totalIncome += expense.amount || 0;
          } else if (expense.amountType === 'expense') {
              accumulator.totalExpense += expense.amount || 0;
          }

          // Update balance dynamically
          accumulator.balance = accumulator.totalIncome - accumulator.totalExpense;
     
      
              return accumulator;
          },
          { totalIncome: 0, totalExpense: 0, balance: 0 } // Initialize totals
      );
      
    }

    // Default behavior for other categories
    return expenseData.reduce((accumulator, expense) => {
        const isMatchingCategory =
            expense.categoryId.toLowerCase() === categoryId.toLowerCase();   

        if (isMatchingCategory ) {
            accumulator += expense.amount || 0;
        }

        return accumulator;
    }, 0);
    
}, [expenseData]);

function getCurrentFinancialYear() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  return currentMonth >= 3 ? `${currentYear}-${currentYear + 1}` : `${currentYear - 1}-${currentYear}`;
}

function getPreviousFinancialYear () {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  return currentMonth >= 3 ? `${currentYear - 1}-${currentYear}` : `${currentYear - 2}-${currentYear - 1}`;
}


  return (
    <Flex flexDir="column" gap={2} w="100vw" justifyContent="center">
      <Header />
      <TotalExpenseCard
       data={calculateTotal(showYearlyExpenses ? 'yearly' : 'monthly')}
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
  templateColumns={{ base: "1fr", md: "1fr 1fr" }} 
  gap={6}
>
  {/* Income Categories */}
  <Box>
    <Text fontSize="2xl" padding={5} mb={4} color="whiteAlpha.900">
      Income Categories
    </Text>
    <Grid 
      templateColumns={{ base: "1fr 1fr 1fr"  }} 
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
              total: calculateTotal(category.name,) 
            }} 
          />
        ))
      ) : (
        <Text color="whiteAlpha.700">No Income Categories</Text>
      )}
    </Grid>
  </Box>

  {/* Expense Categories */}
  <Box 
  >
    <Text fontSize="2xl" padding={5} mb={4} color="whiteAlpha.900">
      Expense Categories
    </Text>
    <Grid 
      templateColumns={{ base: "1fr 1fr 1fr",  }} 
      gap={4} 
      px={{ base: 5, md: 10 }} 
      py={5}
    >
      {categories.expense?.length ? (
        categories.expense.map(category => (
          <ExpenseCard 
            key={category.$id} 
            category={{ 
              ...category, 
              total: calculateTotal(category.name) 
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
  <PopoverBody display="flex" flexDir="column" gap={1} maxH="200px" overflowY="auto">
    <Button
      w="100%"
      bgColor={showYearlyExpenses ? "pink.500" : "inherit"}
      _hover={{ bgColor: "pink.600" }}
      _active={{ bgColor: "pink.600" }}
      onClick={() => {
        setShowYearlyExpenses(true);
        
      setSelectedYear(currentFinancialYear);
      }}
    >
     View Yearly
    </Button>
    <Button
      w="100%"
      bgColor={showYearlyExpenses ? "inherit" : "pink.500"}
      _hover={{ bgColor: "pink.600" }}
      _active={{ bgColor: "pink.600" }}
      onClick={() => {
        setShowYearlyExpenses(false);
        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        setSelectedMonth(currentMonth);
        setSelectedYear(new Date().getFullYear());
      }}
    >
      View Monthly
    </Button>
    {showYearlyExpenses ? (
      <>
  <Button
    w="100%"
    bgColor={selectedYear === currentFinancialYear ? "pink.500" : "inherit"}
    _hover={{ bgColor: "pink.600" }}
    _active={{ bgColor: "pink.600" }}
    onClick={() => {
      setSelectedYear(currentFinancialYear);
    }}
  >
    {currentFinancialYear}
  </Button>
  <Button
    w="100%"
    bgColor={selectedYear === previousFinancialYear ? "pink.500" : "inherit"}
    _hover={{ bgColor: "pink.600" }}
    _active={{ bgColor: "pink.600" }}
    onClick={() => {
   
      setSelectedYear(previousFinancialYear);
    }}
  >
    {previousFinancialYear}
  </Button>
</>
    ) : (
      months
      .filter((month, index) => index <= currentMonth)
      .map((month) =>(
        <Button
          key={month}
          w="100%"
          bgColor={selectedMonth === month && selectedYear === new Date().getFullYear() ? "pink.500" : "inherit"}
          _hover={{ bgColor: "pink.600" }}
          _active={{ bgColor: "pink.600" }}
          onClick={() => {
            setSelectedMonth(month);
            setSelectedYear(new Date().getFullYear());
          }}
        >
          {month}
        </Button>
      ))
    )}
  </PopoverBody>
</PopoverContent>
        </Portal>
      </Popover>
      )
    }
     {
      !loading && ['admin','personal.varshathgupta@gmail.com']?.includes(userId)&&(
        <Popover placement="top-end" closeOnBlur closeOnEsc onClose={onCloseRight} isOpen={isOpenRight}>
        <PopoverTrigger>
          <AddCategoryButton />
        </PopoverTrigger>
      </Popover>
      )
     }
      
    </Flex>
  );
}

export default Dashboard;
