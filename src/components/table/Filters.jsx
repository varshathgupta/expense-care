import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
// import { categories } from "../../pages/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import {
  filterActions,
  updateFilteredExpenses,
} from "../../store/filter-slice";
import { SlidersHorizontal } from "lucide-react";
import { fetchData } from "../../store/data-actions";
import { account } from "../../appwrite/appwrite-config";
import { loadingActions } from "../../store/loading-slice";

export const yearRange = [2023,2024];

export const months = [
  {
    option: "January",
    value: 0,
  },
  {
    option: "February",
    value: 1,
  },
  {
    option: "March",
    value: 2,
  },
  {
    option: "April",
    value: 3,
  },
  {
    option: "May",
    value: 4,
  },
  {
    option: "June",
    value: 5,
  },
  {
    option: "July",
    value: 6,
  },
  {
    option: "August",
    value: 7,
  },
  {
    option: "September",
    value: 8,
  },
  {
    option: "October",
    value: 9,
  },
  {
    option: "November",
    value: 10,
  },
  {
    option: "December",
    value: 11,
  },
];

const sortBy = [
  { value: "amountAscending", option: "Amount (Lowest first)" },
  { value: "amountDescending", option: "Amount (Highest first)" },
  { value: "dateAscending", option: "Date (Oldest First)" },
  { value: "dateDescending", option: "Date (Latest First)" },
];

function Filters({
  setFilteredExpenses,
  windowWidth,
  setShowAllColumns,
  showAllColumns,
}) {
  const filters = useSelector((state) => state.filter.filterInputs);
  const dispatch = useDispatch();
  const [filtersVisibility, setFiltersVisibility] = useState(false);

  const [filterInputs, setFilterInputs] = useState(filters);
  const [searchInput, setSearchInput] = useState("");

  // const categories = useSelector((state) => state.data.categories);

  function searchHandler() {
    dispatch(loadingActions.setLoading(true));
    setFilteredExpenses((expenses) =>
      expenses.filter((expense) => expense.name.includes(searchInput))
    );
    dispatch(loadingActions.setLoading(false));
  }

  function filterHandler() {
    dispatch(loadingActions.setLoading(true));
    dispatch(filterActions.setFilterInputs(filterInputs));
    dispatch(updateFilteredExpenses(filterInputs));
    dispatch(loadingActions.setLoading(false));
  }

  function resetHandler() {
    dispatch(loadingActions.setLoading(true));
    setSearchInput("");
    dispatch(filterActions.resetFilterInputs());
    // account.get().then(
    //   (user) => {
    //     dispatch(fetchData(user.$id));
    //   },
    //   (error) => console.log(error)
    // );
    dispatch(loadingActions.setLoading(false));
  }

  function showAllColumnsHandler() {
    setShowAllColumns((prev) => !prev);
  }

  useEffect(() => {
    dispatch(loadingActions.setLoading(true));
    setFilterInputs(filters);
    dispatch(loadingActions.setLoading(false));
  }, [filters]);

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
              {/* {categories.map((category) => (
                <MenuItem
                  _hover={{ bgColor: "blue.600" }}
                  key={category.id}
                  data-key={category.id}
                  value={category.name}
                  bgColor={"lightgray"}
                  onClick={(e) => {
                    setFilterInputs((prev) => ({
                      ...prev,
                      categoryId: e.target.getAttribute("data-key"),
                      categoryName: e.target.value,
                    }));
                  }}
                >
                  {category.name}
                </MenuItem>
              ))} */}
            </MenuList>
          </Menu>

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
              // w={"max-content"}
              w={"225px"}
            >
              {filterInputs.year || "Year"}
            </MenuButton>
            <MenuList bgColor={"lightgray"}>
              {yearRange.map((year) => (
                <MenuItem
                  _hover={{ bgColor: "blue.600" }}
                  key={year}
                  value={year}
                  bgColor={"lightgray"}
                  onClick={(e) =>
                    setFilterInputs((prev) => ({
                      ...prev,
                      year: e.target.value,
                    }))
                  }
                >
                  {year}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
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
              // w={"max-content"}
              w={"225px"}
            >
              {filterInputs.monthName || "Month"}
            </MenuButton>
            <MenuList bgColor={"lightgray"}>
              {months.map((month) => (
                <MenuItem
                  _hover={{ bgColor: "blue.600" }}
                  key={month.value}
                  data-key={month.value}
                  value={month.option}
                  bgColor={"lightgray"}
                  onClick={(e) =>
                    setFilterInputs((prev) => ({
                      ...prev,
                      month: e.target.getAttribute("data-key"),
                      monthName: e.target.value,
                    }))
                  }
                >
                  {month.option}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
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
              // w={"max-content"}
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
            display={windowWidth < 768 ? "flex" : "none"}
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

    // Columnfilter
  );
}

export default Filters;
