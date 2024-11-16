import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { Card, CardBody, CardFooter, CardHeader, Text } from "@chakra-ui/react";
import  { useState } from "react";
import AddExpenseButton from "./AddExpenseButton";
import { useDispatch, useSelector } from "react-redux";
import {
  filterActions,
  updateFilteredExpenses,
} from "../../store/filter-slice";
import { months } from "../table/Filters";
import { useNavigate } from "react-router-dom";

function ExpenseCard({ category, }) {
  const { name, total, id, subCategories, type, userId, userEmail } = category;
  const [hover, setHover] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filterInputs = useSelector((state) => state.filter.filterInputs);
  // const showYearlyExpenses = useSelector(
  //   (state) => state.data.yearlyExpenseOnCard
  // );

  function clickHandler() {
    const [currYear, currMonth] = [
      new Date().getFullYear(),
      new Date().getMonth(),
    ];
    dispatch(
      filterActions.setFilterInputs({
        id,
        categoryName: name,
        sortBy: null,
        sortByOption: null,
        year: currYear,
        month: currMonth,
        monthName: months.find((month) => month.value === currMonth).option,
      })
    );

    dispatch(updateFilteredExpenses(filterInputs));

    navigate("/all-expenses");
  }

  return (
    <Card
      h={"180px"}
      w={{ base: "300px", md: "300px" }}
      bgColor={"blue.700"}
      textAlign={"center"}
      color={"text"}
      p={1}
      variant={"elevated"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      borderRadius={"20px"}
    >
      <CardHeader fontSize={"xl"} fontWeight={"semibold"} padding={'10px'}>
        <Text>{name}</Text>
      </CardHeader>
      <CardBody
        fontSize={"2xl"}
        fontWeight={"semibold"}
        onClick={clickHandler}
        cursor={"pointer"}
        style={{
          padding: '0px'
        }}
      >
        &#x20b9; {total}
      </CardBody>
      <CardFooter padding={'20px'}>
        <AddExpenseButton
          hover={hover}
          setHover={setHover}
          categoryName={name}
          categoryId={id}
          subCategories={subCategories}
          type={type}
          userId={userId}
          userEmail={userEmail}
        />
      </CardFooter>
    </Card>
  );
}

// Prop validation
ExpenseCard.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    currYearExpense: PropTypes.number.isRequired,
    currMonthExpense: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    subCategories: PropTypes.array,
    type: PropTypes.string,
    userId: PropTypes.string,
    userEmail: PropTypes.string,
    total: PropTypes.number.isRequired,
  }).isRequired,
  
};

export default ExpenseCard;
