import { DeleteIcon } from "@chakra-ui/icons";
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
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, removeExpense } from "../../store/data-actions";
import { loadingActions } from "../../store/loading-slice";

function RemoveExpenseButton({ expense }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const dispatch = useDispatch();

  function deleteExpenseHandler() {
    dispatch(loadingActions.setLoading(true));
    dispatch(removeExpense(expense.$id, expense));
    onClose();
    dispatch(loadingActions.setLoading(false));
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
              Are you sure? You can't undo this action afterwards.
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

export default RemoveExpenseButton;
