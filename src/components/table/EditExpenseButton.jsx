import { useRef, useState } from "react";
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
  useToast,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { editExpense } from "../../store/data-actions";
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

function EditExpenseButton({ expense }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [expenseInputData, setExpenseInputData] = useState({
    name: expense.name,
    amount: expense.amount,
    description: expense.description,
    date: expense.date, // Added date field
  });

  const initialRef = useRef(null);
  const dispatch = useDispatch();
  const toast = useToast();

  function editExpenseHandler(e) {
    e.preventDefault();
    dispatch(editExpense(expense.$id, { ...expenseInputData }))
      .then(() => {
        toast({
          title: "Expense Edited Successfully",
          status: "success",
          colorScheme: "teal",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch(() => {
        toast({
          title: "Error Editing Expense",
          description: "There was an error while editing the expense.",
          status: "error",
          colorScheme: "red",
        });
      });
    onClose();
   
   
  }

  return (
    <>
      <MenuItem
        onClick={onOpen}
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
          <form onSubmit={editExpenseHandler}>
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
                      amount: parseFloat(e.target.value),
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
              <FormControl mb={2}>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={expenseInputData.date ? new Date(expenseInputData.date).toISOString().slice(0, 10) : ''} // Convert to date format
                  onChange={(e) =>
                    setExpenseInputData((prev) => ({
                      ...prev,
                      date: new Date(e.target.value).toISOString(),
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

// PropTypes validation for the component
EditExpenseButton.propTypes = {
  expense: PropTypes.shape({
    name: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    description: PropTypes.string,
    date: PropTypes.string,
    $id: PropTypes.string.isRequired,
  }).isRequired,
};

export default EditExpenseButton;
