import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { Card, CardBody, CardFooter, CardHeader, Text } from "@chakra-ui/react";
import  { useState } from "react";
import AddExpenseButton from "./AddExpenseButton";

function ExpenseCard({ category, }) {
  const { name, total, id, subCategories, type, userId } = category;
  const userEmail = localStorage.getItem("userEmail");
  const [hover, setHover] = useState(false);
  const blockAddExpense = userEmail ==="visitor@expsecare.com"

  return (
    <Card
      h={blockAddExpense ?"100px": "140px"}
      w={{ base: "250px", md: "200px" , sm:'100px'}}
      bgColor={"blue.700"}
      textAlign={"center"}
      display={'flex'}
      justifyContent={"space-between"}
      alignItems={"space-between"}
      gap={1}
      color={"text"}
      variant={"elevated"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      borderRadius={"5px"}
    >
      <CardHeader fontSize={"md"} fontWeight={"semibold"} padding={'9px'}>
        <Text>{name}</Text>
      </CardHeader>
      <CardBody
        fontSize={"2xl"}
        fontWeight={"semibold"}
        style={{
          padding: '0px'
        }}
      >
        &#x20b9; {total}
      </CardBody>
      {
      ! blockAddExpense && (
          <AddExpenseButton
          hover={hover}
          setHover={setHover}
          categoryName={name}
          categoryId={id}
          subCategories={subCategories}
          type={type}
          userId={userId}
        />
        )
      }
      <CardFooter padding={'20px'}>
       
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
