import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function TotalExpenseCard({ userCurrYearExpense, userCurrMonthExpense }) {
  return (
    <Flex
      bgColor={"lightgray"}
      border={"solid"}
      borderWidth={"thin"}
      rounded={"lg"}
      w={"80%"}
      justify={"space-around"}
      mt={5}
      mx={"auto"}
      alignItems={"center"}
      p={5}
      fontSize={"large"}
      fontWeight={"semibold"}
      flexDir={{ base: "column", md: "row" }}
      gap={{ base: "10px" }}
    >
      <Text>Current Year:  <b style={{color:'#d53f8c'}}> &#x20b9;{userCurrYearExpense}</b> </Text>
      <Text>Current Month: <b style={{color:'#d53f8c'}}> &#x20b9;{userCurrMonthExpense}</b></Text>
      <Button
        as={Link}
        rightIcon={<ArrowForwardIcon />}
        to="/charts"
        rounded={"lg"}
        bgColor={"dark"}
        _hover={{ border: "1px" }}
      >
        Current Month&apos;s Charts
      </Button>
    </Flex>
  );
}

TotalExpenseCard.propTypes = {
  userCurrYearExpense: PropTypes.number.isRequired, // Added prop validation
  userCurrMonthExpense: PropTypes.number.isRequired, // Added prop validation
};

export default TotalExpenseCard;
