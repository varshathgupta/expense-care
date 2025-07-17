import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function TotalExpenseCard({ data }) {
  TotalExpenseCard.propTypes = {
    
    data: PropTypes.shape({
      totalIncome: PropTypes.number.isRequired,
      totalExpense: PropTypes.number.isRequired,
      balance: PropTypes.number.isRequired,
    }).isRequired,

  };
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
      <Text>Total Income:  <b style={{color:'#6ca509'}}> &#x20b9;{data.totalIncome}</b> </Text>
      <Text>Total Expense: <b style={{color:'#d53f8c'}}> &#x20b9;{data.totalExpense}</b></Text>
      <Text>Total Savings: <b style={{color: data.balance >0 ?'#6ca509':'#d53f8c'}}> &#x20b9; {data.balance}</b></Text>
      <Button
        as={Link}
         color={"#fff"}
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


export default TotalExpenseCard;
