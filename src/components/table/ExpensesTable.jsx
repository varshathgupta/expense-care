import { useState } from "react";
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
  Select, // Import Select for user to choose expenses per page
} from "@chakra-ui/react";
import { MoreVertical } from "lucide-react";
import EditExpenseButton from "./EditExpenseButton";
import RemoveExpenseButton from "./RemoveExpenseButton";
import Pagination from "./Pagination";
import PropTypes from 'prop-types';

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
      </MenuList>
    </Menu>
  );
}

// Add PropTypes validation for DropdownActions
DropdownActions.propTypes = {
  expense: PropTypes.object.isRequired, // Ensure expense is an object and is required
};

function ExpensesTable({ filteredExpenses, showAllColumns }) {
  // For Pagination

  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage, setExpensesPerPage] = useState(5); // Allow user to select expenses per page
  const totalPages = Math.ceil(filteredExpenses.length / expensesPerPage);

  // Calculate the index of the first and last expense on the current page
  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense);

  if (filteredExpenses.length === 0) {
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

  // Add PropTypes validation
  ExpensesTable.propTypes = {
    filteredExpenses: PropTypes.array.isRequired,
    showAllColumns: PropTypes.bool.isRequired,
  };

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
              <Th textColor={"blue.500"}>Transactions</Th>
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
              <Th textColor={"blue.500"}>DESCRIPTION</Th>
              <Th textColor={"blue.500"}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentExpenses.map((expense) => (
              <Tr key={expense.$id} _hover={{ bgColor: "dark" }}>
                <Td>{expense.name}</Td>
                <Td>{expense.amount}</Td>
                <Td display={showAllColumns ? "table-cell" : "none"}>
                  {expense.categoryId}
                </Td>
                <Td display={showAllColumns ? "table-cell" : "none"}>
                  {new Date(expense.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </Td>
                <Td>{expense.description}</Td>
                <Td>
                  <DropdownActions expense={expense} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      
      <Flex justifyContent="flex-start" mb={4} w="100%">
        <Text
          fontStyle={"italic"}
          textColor={"whiteAlpha.600"}
          mx={2} // Adjusted margin for better alignment
        >
          Showing{" "}
          {currentExpenses.length} out of {filteredExpenses.length} expenses
        </Text>
        <Select
          value={expensesPerPage}
          onChange={(e) => setExpensesPerPage(Number(e.target.value))}
          width="auto"
          label="Select expenses per page"
          ml={2} // Added margin-left for spacing
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </Select>
      </Flex>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}

export default ExpensesTable;
