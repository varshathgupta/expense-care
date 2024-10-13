import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import Header from "./Header";
import { Link } from "react-router-dom";

function Error() {
  return (
    <>
      <Header />
      <Flex
        h={"80vh"}
        flexDir={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={4}
      >
        <Text fontSize={"4xl"} color={"primary"}>
          Error Occured!
        </Text>
        <Text>Try to naviagte using the navbar at the top.</Text>
        <Text>Or</Text>
        <Text>
          Try{" "}
          <Button as={Link} to={"/login"} colorScheme="blue">
            Login
          </Button>{" "}
        </Text>
      </Flex>
    </>
  );
}

export default Error;
