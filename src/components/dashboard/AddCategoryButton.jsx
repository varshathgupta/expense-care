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
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import  { useRef, useState } from "react";
import { useDispatch,} from "react-redux";
import { addCategory } from "../../store/data-actions";
import { loadingActions } from "../../store/loading-slice";

function AddCategoryButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [categoryData, setCategoryData] = useState({
    name: "",
    type: "expense",
    types: ""
  });

  const initialRef = useRef(null);

  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail");
  const toast = useToast();

  function createCategoryHandler(e) {
    e.preventDefault();
    
    // Convert types string to array and trim whitespace
    const typesArray = categoryData.types
      .split(",")
      .map(type => type.trim())
      .filter(type => type.length > 0);

    dispatch(loadingActions.setLoading(true));
    dispatch(addCategory(userId, userEmail, {
      ...categoryData,
      subCategories: typesArray
    }));
    onClose();
    dispatch(loadingActions.setLoading(false));
    toast({
      title: "Category created successfully",
      status: "success",
      colorScheme: "teal",
    });
    // Reset form data
    setCategoryData({
      name: "",
      type: "expense", 
      types: ""
    });
    setTimeout(()=>{
      window.location.reload();
    },[1000])
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form when modal is opened
  const handleOpen = () => {
    setCategoryData({
      name: "",
      type: "expense",
      types: ""
    });
    onOpen();
  };

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
        onClick={handleOpen}
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
          <ModalHeader>Create Category</ModalHeader>
          <ModalCloseButton />
          <form>
            <ModalBody pb={6}>
              <FormControl mb={4}>
                <FormLabel>Category Name</FormLabel>
                <Input
                  ref={initialRef}
                  name="name"
                  value={categoryData.name}
                  onChange={handleInputChange}
                  placeholder="Category Name"
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Category Type</FormLabel>
                <RadioGroup
                  name="type"
                  value={categoryData.type}
                  onChange={(value) => setCategoryData(prev => ({...prev, type: value}))}
                >
                  <Stack direction="row">
                    <Radio value="expense">Expense</Radio>
                    <Radio value="income">Income</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl>
                <FormLabel>
                  {categoryData.type === "income" ? "Income Types" : "Expense Types"}
                </FormLabel>
                <Textarea
                  name="types"
                  value={categoryData.types}
                  onChange={handleInputChange}
                  placeholder="Enter types separated by commas"
                  rows={4}
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
