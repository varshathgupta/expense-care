import { EditIcon } from "@chakra-ui/icons";
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
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { editCategoryName } from "../../store/data-actions";

function EditCategoryNameButton({ hover, setHover, categoryName, categoryId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [inputCategoryName, setInputCategoryName] = useState(categoryName);

  const initialRef = useRef(null);

  const dispatch = useDispatch();

  function editCategoryNameHandler(e) {
    e.preventDefault();
    dispatch(editCategoryName(categoryId, inputCategoryName));
    onClose();
  }

  return (
    <>
      <Button
        pos={"absolute"}
        top={1}
        left={1}
        color={"dark"}
        bgColor={"whiteAlpha.800"}
        _hover={{ bgColor: "whiteAlpha.700" }}
        display={!hover && "none"}
        onClick={() => {
          onOpen();
          setHover(false);
        }}
      >
        <EditIcon />
      </Button>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bgColor={"lightgray"}>
          <ModalHeader>Edit</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={(e) => editCategoryNameHandler(e)}>
            <ModalBody pb={6}>
              <FormControl mb={2}>
                <FormLabel ref={initialRef}>Category Name</FormLabel>
                <Input
                  value={inputCategoryName}
                  onChange={(e) => setInputCategoryName(e.target.value)}
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

export default EditCategoryNameButton;
