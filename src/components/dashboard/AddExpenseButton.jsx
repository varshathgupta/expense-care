import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense } from "../../store/data-actions";
import { loadingActions } from "../../store/loading-slice";
import { expenseNames } from "../../assets/ExpenseNameData";

const initialState = {
  name: "",
  amount: 0,
  description: "",
};

function AddExpenseButton({ hover, categoryName, setHover, categoryId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [expenseInputData, setExpenseInputData] = useState({
    name: "",
    amount: 0,
    description: "",
  });
  const[expenseList,setExpenseList] = useState([])

  const initialRef = useRef(null);
  const userId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();
  useEffect(()=>{
    if(categoryId){
  const filteredExpense =  expenseNames[categoryId]
  setExpenseList(filteredExpense)
    }
   
  },[categoryId])

  function addExpenseHandler(e) {
    // e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    dispatch(loadingActions.setLoading(true));
    dispatch(addExpense(userId, categoryId, expenseInputData, categoryName));
    setExpenseInputData(initialState);
    onClose();
    dispatch(loadingActions.setLoading(false));
  }

  return (
    <>
      <Button
        colorScheme="pink"
        mx={"auto"}
        w={"150px"}
        // display={hover ? "block" : "none"}
        onClick={() => {
          onOpen();
          setHover(false);
        }}
      >
        Add expense
      </Button>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bgColor={"lightgray"}>
          <ModalHeader>Add Expense to {categoryName}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={(e) => addExpenseHandler(e)}>
            <ModalBody pb={6}>
              <FormControl mb={2}>
                <FormLabel ref={initialRef}>Expense</FormLabel>
               
                <Select
            id="expense"
            value={expenseInputData.name}
            onChange={(e) =>
              setExpenseInputData((prev) => ({
                ...prev,
                name: e.target.value,
              }))}
           
          >
            <option value="" disabled>Select an expense</option>
            {expenseList?.map((expense, index) => (
              <option key={index} value={expense}>{expense}</option>
            ))}
          </Select>
              </FormControl>
              <FormControl mb={2}>
                <FormLabel>Amount</FormLabel>
                <Input
                  value={expenseInputData.amount}
                  onChange={(e) =>
                    setExpenseInputData((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  placeholder="in Rs."
                />
              </FormControl>
              <FormControl mb={2}>
                <FormLabel>Description (Optional)</FormLabel>
                <Textarea
                  placeholder="Type description here"
                  value={expenseInputData.description}
                  onChange={(e) =>
                    setExpenseInputData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="pink" mr={3} type="submit">
                Add
              </Button>
              <Button
                border={"1px"}
                color={"lightgray"}
                bgColor={"whiteAlpha.800"}
                onClick={onClose}
                _hover={{ bgColor: "whiteAlpha.700" }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddExpenseButton;
