import React from "react";
import {
  Button,
  Flex,
  MenuItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";


function InfoExpenseButton({ expense }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        Info
      </MenuItem>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick
        closeOnEsc
        isCentered={true}
      >
        <ModalOverlay />
        <ModalContent bgColor={"lightgray"} border={"1px"}>
          <ModalHeader textAlign={"center"}>{expense.name}</ModalHeader>
          {/* <ModalCloseButton /> */}

          <ModalBody textAlign={"center"}>
            <Flex flexDir={"column"} gap={8}>
              <Text>Amount: Rs. {expense.amount}</Text>
              <Text>Created: {expense.date}</Text>
              <Text>Category: {expense.category}</Text>
              <Text>
                Description:{" "}
                {expense.description.length === 0
                  ? "No description was given at the time of creation"
                  : expense.description}
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="pink" mx={"auto"} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default InfoExpenseButton;
