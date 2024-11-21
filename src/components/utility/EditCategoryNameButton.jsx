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
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { editCategoryName } from "../../store/data-actions";
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

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
          <form onSubmit={editCategoryNameHandler}>
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

EditCategoryNameButton.propTypes = {
  hover: PropTypes.bool.isRequired, // Ensure hover is a boolean and is required
  setHover: PropTypes.func.isRequired, // Ensure setHover is a function and is required
  categoryName: PropTypes.string.isRequired, // Ensure categoryName is a string and is required
  categoryId: PropTypes.string.isRequired, // Ensure categoryId is a string and is required
};

export default EditCategoryNameButton;
