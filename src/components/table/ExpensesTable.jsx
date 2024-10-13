import React, { useEffect, useState } from "react";
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { MoreVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import EditExpenseButton from "./EditExpenseButton";
import RemoveExpenseButton from "./RemoveExpenseButton";
import Pagination from "./Pagination";
import { updateFilteredExpenses } from "../../store/filter-slice";
import { loadingActions } from "../../store/loading-slice";
import InfoExpenseButton from "./InfoExpenseButton";

function DropdownActions({ expense }) {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<MoreVertical />}
        bgColor={"inherit"}
        _hover={{ bgColor: "lightgray" }}
        _focus={{ bgColor: "lightgray" }}
        _active={{ bgColor: "lightgray" }}
      />
      <MenuList bgColor={"lightgray"}>
        <EditExpenseButton expense={expense} />
        <RemoveExpenseButton expense={expense} />
        <InfoExpenseButton expense={expense} />
      </MenuList>
    </Menu>
  );
}

function ExpensesTable({ filteredExpenses, windowWidth, showAllColumns }) {
  // For Pagination
  const totalFilteredExpenses = useSelector(
    (state) => state.filter.totalFilteredExpenses
  );
  const filterInputs = useSelector((state) => state.filter.filterInputs);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const expensesPerPage = 5;
  const totalPages = Math.ceil(totalFilteredExpenses / 5);
  const indexOfFirstExpense = currentPage * expensesPerPage - expensesPerPage;

  useEffect(() => {
    dispatch(
      updateFilteredExpenses({
        ...filterInputs,
        limit: expensesPerPage,
        offset: indexOfFirstExpense,
      })
    );
  }, [currentPage]);

  if (filteredExpenses?.length === 0) {
    return (
      <Flex
        bgColor={"lightgray"}
        justifyContent={"center"}
        alignItems={"center"}
        p={5}
        w={"90vw"}
        mx={"auto"}
      >
        <Text>No expense to display</Text>
      </Flex>
    );
  }

  return (
    <>
      <TableContainer
        w={"90%"}
        mx={"auto"}
        bgColor={"lightgray"}
        p={"2rem"}
        rounded={"lg"}
        mb={"2rem"}
      >
        <Table>
          <Thead>
            <Tr>
              {/* <Th>
              <Checkbox>Select</Checkbox>
            </Th> */}
              <Th textColor={"blue.500"}>EXPENSE NAME</Th>
              <Th textColor={"blue.500"}>AMOUNT (Rs.)</Th>
              <Th
                textColor={"blue.500"}
                display={showAllColumns ? "table-cell" : "none"}
              >
                CATEGORY
              </Th>
              <Th
                textColor={"blue.500"}
                display={showAllColumns ? "table-cell" : "none"}
              >
                DATE
              </Th>
              <Th textColor={"blue.500"}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredExpenses?.map((expense) => (
              <Tr key={expense.$id} _hover={{ bgColor: "dark" }}>
                {/* <Td>
                <Checkbox colorScheme="teal" />
              </Td> */}
                <Td>{expense.expenseName}</Td>
                <Td>{expense.amount}</Td>
                <Td display={showAllColumns ? "table-cell" : "none"}>
                  {expense.category}
                </Td>
                <Td display={showAllColumns ? "table-cell" : "none"}>
                  {expense.date}
                </Td>
                <Td>
                  <DropdownActions expense={expense} />
                </Td>
              </Tr>
            ))}
          </Tbody>
          {/* <Tfoot>
          <Tr>
            <Th>To convert</Th>
            <Th>into</Th>
            <Th isNumeric>multiply by</Th>
          </Tr>
        </Tfoot> */}
        </Table>
      </TableContainer>
      <Text
        fontStyle={"italic"}
        textColor={"whiteAlpha.600"}
        w={"90vw"}
        mx={"auto"}
      >
        Showing{" "}
        {currentPage === totalPages
          ? totalFilteredExpenses - (currentPage - 1) * expensesPerPage
          : expensesPerPage}{" "}
        out of {totalFilteredExpenses} expenses
      </Text>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}

export default ExpensesTable;
