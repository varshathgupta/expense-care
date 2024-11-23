import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";
import  { useRef } from "react";
import { useDispatch } from "react-redux";
import { removeExpense } from "../../store/data-actions";
import { loadingActions } from "../../store/loading-slice";
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

function RemoveExpenseButton({ expense }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const dispatch = useDispatch();

  function deleteExpenseHandler() {
    dispatch(loadingActions.setLoading(true));
    dispatch(removeExpense(expense.$id, expense));
    onClose();
    dispatch(loadingActions.setLoading(false));
    setTimeout(()=>{
      window.location.reload();
     },[1000])
  }

  return (
    <>
      <MenuItem
        as={"button"}
        onClick={onOpen}
        bgColor={"lightgray"}
        _hover={{ bgColor: "blue.600" }}
      >
        Delete
      </MenuItem>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent bgColor={"lightgray"}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Expense
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                color={"dark"}
                bgColor={"whiteAlpha.800"}
                _hover={{ bgColor: "whiteAlpha.700" }}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deleteExpenseHandler} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

RemoveExpenseButton.propTypes = {
  expense: PropTypes.object.isRequired, // Ensure expense is an object and is required
};

export default RemoveExpenseButton;
