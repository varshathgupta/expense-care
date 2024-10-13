import { Flex, Text, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { account } from "../appwrite/appwrite-config";
import { useNavigate } from "react-router-dom";

function SignupVerification() {
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    const secret = urlParams.get("secret");
    const id = "toast-id";

    const promise = account.updateVerification(userId, secret);

    promise.then(
      (response) => {
        if (!toast.isActive(id)) {
          toast({
            id,
            status: "success",
            title: "Signed up successfully",
            description: "Please Login now",
          });
        }
        navigate("/login");
      },
      (error) => console.log(error)
    );
  }, []);

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

export default SignupVerification;
