import React, { useRef, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense, editExpense } from "../../store/data-actions";
import { loadingActions } from "../../store/loading-slice";

function EditExpenseButton({ expense }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [expenseInputData, setExpenseInputData] = useState({
    name: expense.name,
    amount: expense.amount,
    description: expense.description,
  });

  const initialRef = useRef(null);
  const userId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();

  function editExpenseHandler(e) {
    dispatch(loadingActions.setLoading(true));
    e.preventDefault();
    dispatch(editExpense(expense.$id, { ...expenseInputData }, expense.amount));
    onClose();
    dispatch(loadingActions.setLoading(false));
  }
  return (
    <>
      <MenuItem
        onClick={() => {
          onOpen();
          //   setHover(false);
        }}
        bgColor={"lightgray"}
        _hover={{ bgColor: "blue.600" }}
      >
        Edit
      </MenuItem>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bgColor={"lightgray"}>
          <ModalHeader>Edit Expense</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={(e) => editExpenseHandler(e)}>
            <ModalBody pb={6}>
              <FormControl mb={2}>
                <FormLabel ref={initialRef}>Expense</FormLabel>
                <Input
                  value={expenseInputData.name}
                  onChange={(e) =>
                    setExpenseInputData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Expense Name"
                />
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
                Edit
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

export default EditExpenseButton;
