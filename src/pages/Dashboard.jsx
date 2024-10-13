import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  Button,
  Flex,
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
import { dataActions } from "../store/data-slice";


export const categories = [
  { name: "RECEIPTS", currMonthExpense: 4000, id: "receipts"},
  { name: "CONTRA", currMonthExpense: 4000, id: "contra"},
  { name: "PAYMENTS", currMonthExpense: 15000, id:'payments' },
  { name: "VBS", currMonthExpense: 37000, id:'vbs' },
  { name: "CHRISTMAS & NEW YEAR", currMonthExpense: 1000 , id :'christmas'},
  { name: "WMT & OBLATION", currMonthExpense: 2000 , id:'wmt'},
  { name: "TRANSPORT", currMonthExpense: 2000 , id:'transport'},
];
// export const categories = [];

function Dashboard() {
  const data = useSelector((state) => state.data);
  const dispatch = useDispatch();

  const showYearlyExpenses = useSelector(
    (state) => state.data.yearlyExpensesOnCard
  );
  const { isOpen, onToggle, onClose } = useDisclosure();
  const {  userCurrYearExpense, userCurrMonthExpense } = data;

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

      {/* <Container w={"100%"} mx={"auto"}> */}
      <Text
        textColor={"whiteAlpha.700"}
        fontStyle={"italic"}
        textAlign={"center"}
        mt={2}
      >
        Cards are showing current {showYearlyExpenses ? "year's" : "month's"}{" "}
        expenses
      </Text>
      <Flex
        flexWrap={"wrap"}
        gap={10}
        px={10}
        py={5}
        alignContent="center"
        justifyContent={"center"}
      >
        {categories?.map((category) => (
          <ExpenseCard key={category.$id} category={category} />
        ))}
      </Flex>

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
                  dispatch(dataActions.setYearlyExpensesOnCard(true));
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
                  dispatch(dataActions.setYearlyExpensesOnCard(false));
                  onToggle();
                }}
              >
                Monthly
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  );
}

export default Dashboard;
