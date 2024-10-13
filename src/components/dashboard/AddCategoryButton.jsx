import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../store/data-actions";
import { loadingActions } from "../../store/loading-slice";

function AddCategoryButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [categoryName, setCategoryName] = useState("");

  const initialRef = useRef(null);

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);

  const toast = useToast();

  function createCategoryHandler(e) {
    e.preventDefault();
    dispatch(loadingActions.setLoading(true));
    dispatch(addCategory(userId, categoryName));
    onClose();
    dispatch(loadingActions.setLoading(false));
    toast({
      title: "Category created successfully",
      status: "success",
      colorScheme: "teal",
    });
  }

  return (
    <>
      <IconButton
        rounded={"full"}
        h={"4rem"}
        w={"4rem"}
        position={"fixed"}
        bottom={"1rem"}
        right={"1rem"}
        colorScheme="pink"
        onClick={onOpen}
      >
        <AddIcon />
      </IconButton>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bgColor={"lightgray"}>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <form>
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Input
                  ref={initialRef}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Category Name"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="pink"
                mr={3}
                type="submit"
                onClick={(e) => createCategoryHandler(e)}
              >
                Create
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

export default AddCategoryButton;
