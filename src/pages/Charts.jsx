import React from "react";
import ExpensePieChart from "../components/charts/ExpensePieChart";
import Header from "../components/Header";
import { Flex } from "@chakra-ui/react";
import ExpenseBarGraph from "../components/charts/ExpenseBarGraph";
import ExpenseChartFilter from "../components/charts/ExpenseChartFilter";

function Charts() {
  return (
    <>
      <Header />
      <ExpenseChartFilter />
      <Flex
        mt={"2rem"}
        minH={"75vh"}
        w={"100vw"}
        flexDir={{ base: "column", md: "row" }}
        justifyContent={"space-evenly"}
        alignItems={"center"}
      >
        <ExpenseBarGraph />
        <ExpensePieChart />
      </Flex>
    </>
  );
}

export default Charts;
