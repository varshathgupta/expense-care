
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import {  useNavigate } from "react-router-dom";
import { account } from "../appwrite/appwrite-config";
import { useDispatch, useSelector } from "react-redux";
import { loadingActions } from "../store/loading-slice";
import Loading from "../components/utility/Loading";
import { useEffect, useState } from "react";

function Login() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
const[hideForm,setHideForm]=useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const toast = useToast();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const emailParam = queryParams.get('email');
    const passwordParam = queryParams.get('password');
    
    if (emailParam && passwordParam) {
      setHideForm(true);
      
       const cleanEmail = emailParam.replace(/^'|'$/g, '');
      const cleanPassword = passwordParam.replace(/^'|'$/g, '');
      console.log(cleanEmail,cleanPassword)
      loginHandler({
        email: cleanEmail,
        password: cleanPassword
      });
    }
  }, []);

  async function loginHandler(values) {
    dispatch(loadingActions.setLoading(true));

    const promise = account.createEmailSession(values.email, values.password);
    promise.then(
      (response) => {
        const {  $id: sessionId, providerUid: userEmail } = response;
       localStorage.setItem("userEmail", userEmail);
       localStorage.setItem("userId", userEmail);
       localStorage.setItem("sessionId", sessionId);
      dispatch(loadingActions.setLoading(false));
        navigate("/dashboard");
        toast({
          title: "Logged in Successfully",
          status: "success",
          colorScheme: "teal",
        });
      },
      (error) => {
        console.log(error);
        reset();
        toast({
          title: "Not able to Login",
          description: "Please provide correct email ID and password",
          status: "error",
          colorScheme: "red",
        });
        dispatch(loadingActions.setLoading(false));
      }
    );
  }

 
  if (isLoading) {
    return <Loading loading={isLoading} />;
  }

  return (
    <Flex
      minH={"100vh"}
      minW={"100vw"}
      bgColor={"dark"}
      justifyContent={"center"}
      placeItems={"center"}
      p={5}
    >
      <Flex
        flexDir="column"
        justifyContent={"center"}
        alignItems={"center"}
        gap={8}
      >
        {/* Heading */}
        <Heading color={"teal.400"} textAlign={"center"} size={"3xl"}>
          ExpenseCare
        </Heading>

        {/* Form */}
{
  !hideForm ? (
    <form onSubmit={handleSubmit(loginHandler)}>
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

      {/* set password */}

      <FormControl isInvalid={errors.password}>
        <FormLabel htmlFor="password">Password</FormLabel>
        <Input
          type="password"
          placeholder="Enter password"
          {...register("password", {
            required: "password must not be empty",
            minLength: "minimum password length must be eight",
          })}
        />
        {errors.password ? (
          <FormErrorMessage>{errors.password.message}</FormErrorMessage>
        ) : (
          <FormHelperText textColor={"whiteAlpha.700"}></FormHelperText>
        )}
      </FormControl>

      {/* Login button */}
      <Button colorScheme="pink" width={"full"} type="submit" my={2}>
        Login
      </Button>
     

     
    </Flex>
  </form>
  ) :(
    <div>
      Connecting to demo account...
    </div>
  )
}
        
      </Flex>
    </Flex>
  );
}

export default Login;
