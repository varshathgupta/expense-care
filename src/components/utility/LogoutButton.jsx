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
import { LogOutIcon } from "lucide-react";
import { useRef } from "react";
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

function LogoutButton({ logoutHandler }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  function onLogout() {
    logoutHandler();
    onClose();
  }
  
  return (
    <>
      <Button
        bgColor={"inherit"}
         color={"#fff"}
        onClick={onOpen}
        rightIcon={<LogOutIcon />}
        _hover={{ bgColor: "teal.400" }}
        _active={{ bgColor: "teal.400" }}
        fontWeight={"semibold"}
        pl={{ md: 0 }}
        textDecor={"none"}
      >
        Logout
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
              Logout Confirmation
            </AlertDialogHeader>

            <AlertDialogBody>
              Please confirm if you want to logout.
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
              <Button colorScheme="red" onClick={onLogout} ml={3}>
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

LogoutButton.propTypes = {
  logoutHandler: PropTypes.func.isRequired, // Ensure logoutHandler is a required function
};

export default LogoutButton;
