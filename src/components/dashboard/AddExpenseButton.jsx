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
  Select,
  Textarea,
  useDisclosure,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadingActions } from "../../store/loading-slice";
import { addExpense } from "../../store/data-actions";
import PropTypes from "prop-types"; // Import PropTypes for prop validation

// Array of income categories that will be used to determine amountType
const incomeCategories = ["receipts"];

function AddExpenseButton(props) {
  const { categoryName, setHover, subCategories, type, initialData } = props; // Added initialData prop
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const userEmail = localStorage.getItem("userEmail");
  const [expenseInputData, setExpenseInputData] = useState({
    name: initialData?.name || "", // Use initialData if available
    amount: initialData?.amount || "",
    description: initialData?.description || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    amountType:
      categoryName && incomeCategories.includes(categoryName.toLowerCase())
        ? "income"
        : "expense",
  });
  const initialRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Reset the form data when the modal opens
    if (isOpen) {
      setExpenseInputData({
        name: initialData?.name || "",
        amount: initialData?.amount || "",
        description: initialData?.description || "",
        date: initialData?.date || new Date().toISOString().split("T")[0],
        amountType:
          categoryName && incomeCategories.includes(categoryName.toLowerCase())
            ? "income"
            : "expense",
      });
      setErrors({});
      setFormSubmitted(false);
    }
  }, [isOpen, initialData, categoryName]);

  function validateForm() {
    const newErrors = {};
    if (!expenseInputData.name) {
      newErrors.name = "Expense name is required";
    }
    if (!expenseInputData.amount) {
      newErrors.amount = "Amount is required";
    }
    if (!expenseInputData.description) {
      newErrors.description = "Description is required";
    }
    if (!expenseInputData.date) {
      newErrors.date = "Date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function addExpenseHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    setFormSubmitted(true);

    if (!validateForm()) {
      return;
    }

    dispatch(loadingActions.setLoading(true));
    dispatch(
      addExpense(userEmail, categoryName?.toLowerCase(), expenseInputData)
    );
    setFormSubmitted(false);
    onClose();
    dispatch(loadingActions.setLoading(false));
    setTimeout(() => {
      window.location.reload();
    }, [1000]);
  }

  const handleClose = () => {
    setFormSubmitted(false);
    setErrors({});
    onClose();
  };

  return (
    <>
      <Button
        colorScheme="pink"
        mx={"auto"}
        w={"150px"}
        onClick={() => {
          onOpen();
          setHover(false);
        }}
      >
        Add {type === "income" ? "income" : "expense"}
      </Button>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={handleClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bgColor={"lightgray"}>
          <ModalHeader>
            Add {type === "income" ? "Income" : "Expense"} to {categoryName}
          </ModalHeader>
          <ModalCloseButton onClick={handleClose} />
          <form onSubmit={(e) => addExpenseHandler(e)}>
            <ModalBody pb={6}>
              <FormControl mb={2} isInvalid={formSubmitted && errors.name}>
                <FormLabel ref={initialRef}>
                  {type === "income" ? "Income" : "Expense"}
                </FormLabel>

                <Select
                  id="expense"
                  value={expenseInputData.name}
                  onChange={(e) =>
                    setExpenseInputData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                >
                  <option value="" disabled>
                    Select {type === "income" ? "an income" : "an expense"}
                  </option>
                  {subCategories?.map((expense, index) => (
                    <option
                      key={index}
                      value={expense}
                     style={{ color: "black",}}
                    >
                      {expense}
                    </option>
                  ))}
                </Select>

                {formSubmitted && errors.name && (
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl mb={2} isInvalid={formSubmitted && errors.amount}>
                <FormLabel>Amount</FormLabel>
                <Input
                  type="number"
                  value={expenseInputData.amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      setExpenseInputData((prev) => ({
                        ...prev,
                        amount: value,
                      }));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "e" ||
                      e.key === "E" ||
                      e.key === "+" ||
                      e.key === "-"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder={` ${String.fromCodePoint(0x20b9)}`}
                />
                {formSubmitted && errors.amount && (
                  <FormErrorMessage>{errors.amount}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl mb={2} isInvalid={formSubmitted && errors.date}>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={expenseInputData.date}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setExpenseInputData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
                {formSubmitted && errors.date && (
                  <FormErrorMessage>{errors.date}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                mb={2}
                isInvalid={formSubmitted && errors.description}
              >
                <FormLabel>Description </FormLabel>
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
                {formSubmitted && errors.description && (
                  <FormErrorMessage>{errors.description}</FormErrorMessage>
                )}
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="pink" mr={3} type="submit">
                Add
              </Button>
              <Button
                border={"1px"}
                color={"lightgray"}
                bgColor={"whiteAlpha.800"}
                onClick={handleClose}
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

AddExpenseButton.propTypes = {
  categoryName: PropTypes.string.isRequired,
  setHover: PropTypes.func.isRequired,
  categoryId: PropTypes.string.isRequired,
  subCategories: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    amount: PropTypes.number,
    description: PropTypes.string,
    date: PropTypes.string,
  }),
};

export default AddExpenseButton;
