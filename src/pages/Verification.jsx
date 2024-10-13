import { Flex, Text, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { account } from "../appwrite/appwrite-config";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function Verification() {
  const navigate = useNavigate();

  const googleSession = useSelector((state) => state.auth.googleSession);
  const userId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();
  const toast = useToast();

 

  return (
    <Flex
      minH={"100vh"}
      minW={"100vw"}
      bgColor={"dark"}
      justifyContent={"center"}
      alignItems={"center"}
      p={5}
    >
      <Text textColor={"teal.500"} fontSize={"3xl"}>
        {" "}
        Verifying...
      </Text>
    </Flex>
  );
}

export default Verification;
