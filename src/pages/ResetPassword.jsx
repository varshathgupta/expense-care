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
import { useForm } from "react-hook-form";
import { account } from "../appwrite/appwrite-config";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const {
    handleSubmit,
    register,
    reset,
    resetField,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const toast = useToast();
  const navigate = useNavigate();

  function resetPasswordHandler(values) {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    const secret = urlParams.get("secret");

    const promise = account.updateRecovery(
      userId,
      secret,
      values.password,
      values.confirmPassword
    );

    promise.then(
      (response) => {
        toast({
          status: "success",
          title: "Password Updated Successfully",
          description:
            "Password has been changed successfully, please login now.",
        });
        navigate("/login");
      },
      (error) => {
        toast({
          status: "error",
          title: "Unable to reset password",
          description:
            "Please make sure that you are reseting the password using the link sent your registered email address by expense care",
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
        <Heading
          my={"2rem"}
          color={"teal.400"}
          textAlign={"center"}
          size={"3xl"}
        >
          ExpenseCare
        </Heading>

        {/* Form */}

        <form onSubmit={handleSubmit(resetPasswordHandler)}>
          {/* email */}
          <Flex
            flexDir={"column"}
            gap={2}
            bgColor={"lightgray"}
            color={"whiteAlpha.900"}
            p={10}
            rounded={"xl"}
          >
            {/* <FormControl isInvalid={errors.email}>
               <FormLabel htmlFor="email">Email</FormLabel>
               <Input
                 w={"xs"}
                 type="email"
                 {...register("email", { required: "email is required" })}
               />

               {errors.email ? (
                 <FormErrorMessage>{errors.email.message}</FormErrorMessage>
               ) : (
                 <FormHelperText textColor={"whiteAlpha.700"}></FormHelperText>
               )}
             </FormControl> */}

            {/* set password */}

            <FormControl isInvalid={errors.password}>
              <FormLabel htmlFor="password">Set Password</FormLabel>
              <Input
                w={"xs"}
                type="password"
                {...register("password", {
                  required: "password must not be empty",
                  minLength: "minimum password length must be eight",
                })}
              />
              {errors.password ? (
                <FormErrorMessage>{errors.password.message}</FormErrorMessage>
              ) : (
                <FormHelperText textColor={"whiteAlpha.800"}>
                  Must be atleast 8 characters long
                </FormHelperText>
              )}
            </FormControl>

            {/*confirm password */}

            <FormControl isInvalid={errors.confirmPassword}>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <Input
                type="password"
                {...register("confirmPassword", {
                  required: "password must not be empty",
                  minLength: "minimum password length must be eight",
                })}
              />
              {errors.password && (
                <FormErrorMessage>
                  {errors.confirmPassword.message}
                </FormErrorMessage>
              )}
            </FormControl>

            {/* Signup button */}
            <Button colorScheme="pink" width={"full"} type="submit" mt={"2rem"}>
              Reset Password
            </Button>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
}

export default ResetPassword;
