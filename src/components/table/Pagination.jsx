import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Flex, Text } from "@chakra-ui/react";
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePrevClick = () => setCurrentPage((prev) => prev - 1);
  const handleNextClick = () => setCurrentPage((prev) => prev + 1);
  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Flex
      w="90vw"
      mx="auto"
      justifyContent="center"
      alignItems="center"
      p={4}
      gap="1px"
      mb="1rem"
    >
      <Button
        h={12}
        w={20}
        bgColor="lightgray"
        borderRadius={0}
        mr="1rem"
        cursor="pointer"
        _hover={{ bgColor: "dark", border: "solid", borderColor: "white" }}
        onClick={handlePrevClick}
        isDisabled={currentPage === 1}
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
          borderRadius="none"
          value={pageNumber}
          _hover={{ bgColor: "dark", border: "solid", borderColor: "white" }}
          onClick={() => handlePageClick(pageNumber)}
        >
          {pageNumber}
        </Button>
      ))}
      <Button
        h={12}
        w={20}
        bgColor="lightgray"
        borderRadius={0}
        ml="1rem"
        cursor="pointer"
        _hover={{ bgColor: "dark", border: "solid", borderColor: "white" }}
        onClick={handleNextClick}
        isDisabled={currentPage === totalPages}
      >
        Next <ArrowForwardIcon />
      </Button>
      <Text ml={4} fontSize="lg">
        Page {currentPage} of {totalPages}
      </Text>
    </Flex>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
};

export default Pagination;
