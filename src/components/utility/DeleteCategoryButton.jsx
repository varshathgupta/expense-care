import { DeleteIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory } from "../../store/data-actions";

function DeleteCategoryButton({ hover, setHover, categoryId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);

  function deleteCategoryHandler() {
    dispatch(deleteCategory(userId, categoryId));
    onClose();
  }

  return (
    <>
      <Button
        display={!hover && "none"}
        pos={"absolute"}
        top={1}
        right={1}
        color={"dark"}
        bgColor={"whiteAlpha.800"}
        _hover={{ bgColor: "whiteAlpha.700" }}
        onClick={() => {
          onOpen();
          setHover(false);
        }}
      >
        <DeleteIcon />
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent bgColor={"lightgray"}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Category
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
              <Button colorScheme="red" onClick={deleteCategoryHandler} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default DeleteCategoryButton;
