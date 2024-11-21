import  {  useState } from "react";
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
import { useSelector } from "react-redux";
import EditExpenseButton from "./EditExpenseButton";
import RemoveExpenseButton from "./RemoveExpenseButton";
import Pagination from "./Pagination";
import InfoExpenseButton from "./InfoExpenseButton";
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
        <InfoExpenseButton expense={expense} />
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
  const totalFilteredExpenses = useSelector(
    (state) => state.filter.totalFilteredExpenses
  );
  const [currentPage, setCurrentPage] = useState(1);
  const expensesPerPage = 5;
  const totalPages = Math.ceil(totalFilteredExpenses / 5);
 



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
    windowWidth: PropTypes.number.isRequired,
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
            {filteredExpenses.length > 0 &&filteredExpenses?.map((expense) => (
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
