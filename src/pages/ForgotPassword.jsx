import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadingActions } from "../store/loading-slice";
import { useForm } from "react-hook-form";
import { account } from "../appwrite/appwrite-config";

function ForgotPassword() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const toast = useToast();

  function forgotPasswordHandler(values) {
    const promise = account.createRecovery(
      values.email,
      "http://localhost:3000/reset-password"
    );

    promise.then(
      (response) => {
        toast({
          status: "success",
          title: "Reset password email sent",
          description:
            "An email with the link to reset your password has been sent to the provided email address",
        });
      },
      (error) => {
        toast({
          title: "UnRegistered Email Address",
          status: "info",
          description: "The email address provided has not been registered yet",
        });
        reset();
      }
    );
  }

  return (
    <Flex
      minH={"100vh"}
      minW={"100vw"}
      bgColor={"dark"}
      justifyContent={"center"}
      placeItems="flex-start"
      p={5}
    >
      <Flex
        flexDir="column"
        justifyContent={"center"}
        alignItems={"center"}
        gap={8}
      >
        {/* Heading */}
        <Heading my="2rem" color={"teal.400"} textAlign={"center"} size={"3xl"}>
          ExpenseCare
        </Heading>

        {/* Form */}

        <form onSubmit={handleSubmit(forgotPasswordHandler)}>
          {/* email */}
          <Flex
            flexDir={"column"}
            gap={4}
            bgColor={"lightgray"}
            color={"whiteAlpha.900"}
            p={10}
            rounded={"xl"}
          >
            <FormControl isInvalid={errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                placeholder="Registered Email ID"
                w={"xs"}
                type="email"
                {...register("email", { required: "email is required" })}
              />

              {errors.email ? (
                <FormErrorMessage>{errors.email.message}</FormErrorMessage>
              ) : (
                <FormHelperText textColor={"whiteAlpha.800"}></FormHelperText>
              )}
            </FormControl>

            <Button colorScheme="pink" width={"full"} type="submit" my={2}>
              Forgot Password
            </Button>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
}

export default ForgotPassword;
