import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Flex } from "@chakra-ui/react";
import React from "react";

function Pagination({ currentPage, setCurrentPage, totalPages }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <>
      <Flex
        w={"90vw"}
        mx={"auto"}
        justifyContent={"center"}
        alignItems={"center"}
        p={4}
        gap={"1px"}
        mb={"1rem"}
      >
        <Button
          h={12}
          w={"20"}
          bgColor={"lightgray"}
          borderRadius={0}
          mr={"1rem"}
          cursor={"pointer"}
          _hover={{ bgColor: "dark", border: "solid", borderColor: "white" }}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          isDisabled={!(currentPage !== 1)}
        >
          <ArrowBackIcon /> Prev
        </Button>
        {pageNumbers.map((pageNumber) => (
          <Button
            key={pageNumber}
            h={12}
            w={12}
            data-key={pageNumber}
            bgColor={currentPage === pageNumber ? "dark" : "lightgray"}
            border={currentPage === pageNumber ? "solid" : undefined}
            borderColor={currentPage === pageNumber ? "blue.500" : undefined}
            borderWidth={currentPage === pageNumber ? 1 : undefined}
            borderRadius={"none"}
            value={pageNumber}
            _hover={{ bgColor: "dark", border: "solid", borderColor: "white" }}
            onClick={(e) => setCurrentPage(parseInt(e.target.value))}
          >
            {pageNumber}
          </Button>
        ))}
        <Button
          h={12}
          w={"20"}
          bgColor={"lightgray"}
          // justifyContent={"center"}
          // alignItems={"center"}
          borderRadius={0}
          ml={"1rem"}
          cursor={"pointer"}
          _hover={{ bgColor: "dark", border: "solid", borderColor: "white" }}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          isDisabled={currentPage === totalPages}
        >
          Next <ArrowForwardIcon />
        </Button>
      </Flex>
    </>
  );
}

export default Pagination;
