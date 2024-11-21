import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"; // Removed unused DatePicker import
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadingActions } from "../../store/loading-slice";
import PropTypes from "prop-types"; // Import PropTypes for prop validation

const currentYear = new Date().getFullYear();
export const yearRange = [currentYear - 1, currentYear];

const sortBy = [
  { value: "amountAscending", option: "Amount (Lowest first)" },
  { value: "amountDescending", option: "Amount (Highest first)" },
  { value: "dateAscending", option: "Date (Oldest First)" },
  { value: "dateDescending", option: "Date (Latest First)" },
];

function Filters({ setSearchElements, setShowAllColumns, showAllColumns }) {
  const filters = useSelector((state) => state.filter.filterInputs);
  const dispatch = useDispatch();
  const [filtersVisibility, setFiltersVisibility] = useState(false);
  const [filterInputs, setFilterInputs] = useState(filters);
  const [searchInput, setSearchInput] = useState("");
  const categories = JSON.parse(localStorage.getItem("CategoryList")) || [];
  function searchHandler() {
    setSearchElements({
      search: searchInput,
    });
  }

  function filterHandler() {
    console.log(filterInputs);
    setSearchElements({
      categoryId: filterInputs.categoryId,
      startDate: filterInputs.startDate,
      endDate: filterInputs.endDate,
    });
  }

  function resetHandler() {
    dispatch(loadingActions.setLoading(true));
    setSearchInput("");
    setSearchElements({
      categoryId: "",
      startDate: "",
      endDate: "",
      search: "",
    });
    setFilterInputs(filters); // Reset filter inputs
    dispatch(loadingActions.setLoading(false));
  }

  function showAllColumnsHandler() {
    setShowAllColumns((prev) => !prev);
  }

  return (
    <>
      <FormControl
        mt={{ base: "1rem" }}
        my={{ md: "2rem" }}
        maxW={"90%"}
        mx={"auto"}
      >
        <Flex justifyContent={"center"}>
          <Button
            my={"1rem"}
            display={{ md: "none" }}
            w={"100%"}
            colorScheme="blue"
            onClick={() => setFiltersVisibility((prev) => !prev)}
          >
            Filter Data{" "}
            {filtersVisibility ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>
        </Flex>
        <Flex
          display={{ base: filtersVisibility ? "flex" : "none", md: "flex" }}
          flexDir={{ base: "column", md: "row" }}
          justifyContent={{ base: "center", md: "space-around" }}
          gap={{ base: 5, md: 10 }}
          border={"solid"}
          borderWidth={"thin"}
          borderRadius={"lg"}
          p={5}
          bg={"dark"}
          alignItems={"center"}
        >
          <Menu>
            <MenuButton
              bgColor={"lightgray"}
              _hover={{
                border: "solid",
                borderWidth: "1px",
                borderColor: "text",
              }}
              _active={{ bgColor: "lightgray" }}
              as={Button}
              rightIcon={<ChevronDownIcon />}
              w={"225px"}
            >
              {filterInputs.categoryName || "Category"}
            </MenuButton>
            <MenuList bgColor={"lightgray"}>
              {categories.map((category) => (
                <MenuItem
                  _hover={{ bgColor: "blue.600" }}
                  key={category}
                  data-key={category}
                  value={category}
                  bgColor={"lightgray"}
                  onClick={(e) => {
                    setFilterInputs((prev) => ({
                      ...prev,
                      categoryId: e.target.getAttribute("data-key"),
                      categoryName: e.target.value,
                    }));
                  }}
                >
                  {category}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Flex gap={4}>
            <Input
              type="date"
              placeholder="Start Date"
              value={filterInputs.startDate}
              onChange={(e) =>
                setFilterInputs((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
            />
            <Input
              type="date"
              placeholder="End Date"
              value={filterInputs.endDate}
              onChange={(e) =>
                setFilterInputs((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }))
              }
            />
          </Flex>

          <Menu>
            <MenuButton
              bgColor={"lightgray"}
              _hover={{
                border: "solid",
                borderWidth: "1px",
                borderColor: "text",
              }}
              _active={{ bgColor: "lightgray" }}
              as={Button}
              rightIcon={<ChevronDownIcon />}
              w={"225px"}
            >
              {filterInputs.sortByOption || "Sort By"}
            </MenuButton>
            <MenuList bgColor={"lightgray"}>
              {sortBy.map((sort) => (
                <MenuItem
                  _hover={{ bgColor: "blue.600" }}
                  key={sort.value}
                  data-key={sort.value}
                  value={sort.option}
                  bgColor={"lightgray"}
                  onClick={(e) =>
                    setFilterInputs((prev) => ({
                      ...prev,
                      sortBy: e.target.getAttribute("data-key"),
                      sortByOption: e.target.value,
                    }))
                  }
                >
                  {sort.option}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Button
            colorScheme="pink"
            maxW={"225px"}
            px={"8%"}
            onClick={filterHandler}
          >
            Filter
          </Button>
          <Button
            display={{ md: "none" }}
            bgColor={"lightgray"}
            _hover={{
              border: "solid",
              borderWidth: "1px",
              borderColor: "text",
            }}
            _active={{ bgColor: "lightgray" }}
            onClick={resetHandler}
          >
            Reset
          </Button>
        </Flex>
      </FormControl>

      <Flex
        flexDir={{ base: "column", md: "row" }}
        w={"90%"}
        mx={"auto"}
        mb={"2rem"}
        justify={{ base: "center", md: "space-between" }}
        alignItems={{ base: "center" }}
        gap={{ base: "4" }}
      >
        {/* Search Input and Button */}
        <Flex w={{ base: "90vw" }}>
          <Input
            placeholder="Search Expense Name"
            _placeholder={{ color: "whiteAlpha.700", textAlign: "center" }}
            w={{ base: "100%", md: "250px" }}
            rounded={"none"}
            bgColor={"lightgray"}
            border={"none"}
            _hover={{
              border: "solid",
              borderWidth: "1px",
              borderColor: "text",
            }}
            _active={{ bgColor: "lightgray" }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <IconButton
            colorScheme="pink"
            rounded={"none"}
            onClick={searchHandler}
          >
            <SearchIcon />
          </IconButton>
        </Flex>

        {/* Category and Date Checkbox */}
        <Flex justifyContent={"center"} gap={2} alignItems={"center"}>
          <Button
            display={"none"}
            bgColor={"lightgray"}
            _hover={{
              border: "solid",
              borderWidth: "1px",
              borderColor: "text",
            }}
            _active={{ bgColor: "lightgray" }}
            onClick={showAllColumnsHandler}
            minW={{ base: "90vw" }}
          >
            {showAllColumns ? "Hide Category & Date" : "Show Category & Date"}
          </Button>
          <Button
            display={{ base: "none", md: "flex" }}
            bgColor={"lightgray"}
            _hover={{
              border: "solid",
              borderWidth: "1px",
              borderColor: "text",
            }}
            _active={{ bgColor: "lightgray" }}
            onClick={resetHandler}
          >
            Reset Filters
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

Filters.propTypes = {
  setSearchElements: PropTypes.func.isRequired,
  setShowAllColumns: PropTypes.func.isRequired,
  showAllColumns: PropTypes.bool.isRequired,
};

export default Filters;
