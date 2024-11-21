import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  chartDataActions,
  updateChartData,
} from "../../store/chart-data-slice";
import {
  Button,
  Flex,
  FormControl,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {  yearRange } from "../table/Filters";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { loadingActions } from "../../store/loading-slice";

function ExpenseChartFilter() {
  const { year, month, monthName } = useSelector((state) => state.chartData);

  const filterInputs = { year, month, monthName };

  const [chartFilterInputs, setChartFilterInputs] = useState(filterInputs);

  const dispatch = useDispatch();

  function showChartsHandler() {
    dispatch(loadingActions.setLoading(true));
    dispatch(chartDataActions.setChartInputs(chartFilterInputs));
    dispatch(updateChartData(chartFilterInputs));
    dispatch(loadingActions.setLoading(false));
  }

  useEffect(() => {
    setChartFilterInputs({ ...filterInputs });
    dispatch(updateChartData({ month, year }));
  }, [month, year]);

  return (
    <>
      <FormControl>
        <Flex
          border={"solid"}
          borderWidth={"thin"}
          borderRadius={"lg"}
          maxW={{ base: "90vw", md: "1200px" }}
          mx={"auto"}
          mt={"1rem"}
          justifyContent={"center"}
          gap={{ base: 4, md: 8 }}
          p={8}
          flexDir={{ base: "column", md: "row" }}
          alignItems={"center"}
        >
          <Flex
            w={{ base: "100%", md: "600px" }}
            justifyContent={{ base: "space-between", md: "space-evenly" }}
            flexDir={{ base: "column", sm: "row" }}
            gap={4}
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
                w={{ base: "100%", sm: "225px" }}
              >
                {chartFilterInputs?.year || "Year"}
              </MenuButton>
              <MenuList bgColor={"lightgray"}>
                {yearRange.map((year) => (
                  <MenuItem
                    _hover={{ bgColor: "blue.600" }}
                    key={year}
                    value={year}
                    bgColor={"lightgray"}
                    onClick={(e) =>
                      setChartFilterInputs((prev) => ({
                        ...prev,
                        year: parseInt(e.target.value),
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
                w={{ base: "100%", sm: "225px" }}
              >
                {chartFilterInputs?.monthName || "Month"}
              </MenuButton>
              {/* <MenuList bgColor={"lightgray"}>
                {months.map((month) => (
                  <MenuItem
                    _hover={{ bgColor: "blue.600" }}
                    key={month.value}
                    value={month.option}
                    data-key={month.value}
                    bgColor={"lightgray"}
                    onClick={(e) =>
                      setChartFilterInputs((prev) => ({
                        ...prev,
                        month: parseInt(e.target.getAttribute("data-key")),
                        monthName: e.target.value,
                      }))
                    }
                  >
                    {month.option}
                  </MenuItem>
                ))}
              </MenuList> */}
            </Menu>
          </Flex>

          <Button
            w={{ base: "80vw", md: "300px" }}
            colorScheme="pink"
            onClick={showChartsHandler}
          >
            Show Charts
          </Button>
        </Flex>
      </FormControl>
    </>
  );
}

export default ExpenseChartFilter;
