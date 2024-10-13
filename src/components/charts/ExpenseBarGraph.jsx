import React, { useEffect } from "react";
import { categories as data } from "../../pages/Dashboard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "./ExpensePieChart";
import { Flex, Text, useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";

function ExpenseBarGraph() {
  const data = [
    { category: 'VBS', total: 37200 },
    { category: 'Christmas', total: 25000 },  // Update with real values
    { category: 'Miscellaneous', total: 12000 }
  ];
  const toast = useToast();

  // useEffect(() => {
  //   if (data.length === 0) {
  //     toast({
  //       title: "No Data Present",
  //       description: "No expenses are present as per selected year and month",
  //       status: "info",
  //       colorScheme: "blue",
  //     });
  //   }
  // }, [data]);

  if (data.length === 0) {
    if (data.length === 0) {
      const id = "no-data-toast";

      // if (!toast.isActive(id)) {
      //   toast({
      //     id,
      //     title: "No Data Present",
      //     description: "No expenses are present as per selected year and month",
      //     status: "info",
      //     colorScheme: "blue",
      //   });
      // }
    }
    return (
      <>
        <Text textAlign={"center"}>No data to display Bar Graph</Text>
      </>
    );
  }

  return (
    <>
      <Flex display={{ base: "none", md: "flex" }}>
      <BarChart width={325} height={450} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>
      </Flex>
    </>
  );
}

export default ExpenseBarGraph;
