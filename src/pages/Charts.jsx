import { useEffect, useState } from "react";
import { Box, Flex, Heading, Select, useToast } from "@chakra-ui/react";
import { IncomeExpensePie } from "../components/charts/IncomeExpensePie";
import BarChartByCategory from "../components/charts/BarChartByCategory";
import LineChartTrends from "../components/charts/LineChartTrends";
import Header from "../components/Header";
import { databases } from "../appwrite/appwrite-config";
import { Query } from "appwrite";
import Loading from "../components/utility/Loading";

export default function Charts() {
  const [viewType, setViewType] = useState("monthly");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const now = new Date();
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString();
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  ).toISOString();
  const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
  const endOfYear = new Date(
    now.getFullYear(),
    11,
    31,
    23,
    59,
    59,
    999
  ).toISOString();
  const currentMonthQuery = [
    Query.greaterThanEqual("date", startOfMonth),
    Query.lessThanEqual("date", endOfMonth),
  ];

  const yearlyQuery = [
    Query.greaterThanEqual("date", startOfYear),
    Query.lessThanEqual("date", endOfYear),
  ];

  useEffect(() => {
    fetchData();
  }, [viewType]);

  async function fetchData() {
    setLoading(true);
    try {
      const query = viewType === "monthly" ? currentMonthQuery : yearlyQuery;

      const dat = await databases.listDocuments(
        import.meta.env.VITE_DB_ID,
        import.meta.env.VITE_DB_EXPENSE_ID,
        query
      );
      setData(dat.documents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "No data available",
        description: "Retry or contact admin",
        status: "error",
        colorScheme: "red",
      });
      setLoading(false);
    }
  }

  const handleViewChange = (event) => {
    setViewType(event.target.value);
  };

  return (
    <Flex flexDir="column" gap={2} w="100vw" justifyContent="center">
      <Header />
      {/* View Selector */}
      <Box mb={4} padding={"1rem"}>
        <Select value={viewType} onChange={handleViewChange} width="200px">
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </Select>
      </Box>
      {loading ? (
        <Loading />
      ) : (
        <Flex
          gap={2}
          flexWrap="wrap"
          alignItems={"center"}
          justifyContent={"center"}
        >
          {/* Income vs Expense */}
          <Box margin={"1rem"}>
            <Heading as="h2" size="md" mb={2}>
              Income vs Expense
            </Heading>
            <IncomeExpensePie data={data} />
          </Box>
          {/* Amount by Category */}
          <Box margin={"1rem"}>
            <Heading as="h2" size="md" mb={2} marginBottom={"1rem"}>
              Amount by Category
            </Heading>
            <BarChartByCategory data={data} />
          </Box>
          <Box margin={"1rem"}>
            <Heading as="h2" size="md" mb={2}>
              Trends Over Time
            </Heading>
            <LineChartTrends data={data} />
          </Box>
        </Flex>
      )}

      {/* Trends Over Time */}
    </Flex>
  );
}
