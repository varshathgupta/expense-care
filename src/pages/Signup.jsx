import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Link as RouteLink, useNavigate } from "react-router-dom";
import { account, databases } from "../appwrite/appwrite-config";
import { ID } from "appwrite";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../store/data-actions";
import { authActions } from "../store/auth-slice";
import Loading from "../components/utility/Loading";
import { loadingActions } from "../store/loading-slice";

function Signup() {
  const {
    handleSubmit,
    register,
    reset,
    resetField,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.loading.isLoading);

  async function submitHandler(values) {
    dispatch(loadingActions.setLoading(true));
    const promise = account.create(ID.unique(), values.email, values.password);

    promise.then(
      (user) => {
        const promise = account.createEmailSession(
          values.email,
          values.password
        );

        promise.then(
          (response) => {
            const promise = account.createVerification(
              "http://localhost:3000/signup-verification"
            );

            promise.then(
              () => {
                const {
                  userId,
                  $id: sessionId,
                  providerUid: userEmail,
                } = response;
                dispatch(
                  authActions.setUserData({ userId, sessionId, userEmail })
                );
                dispatch(fetchData(response.userId));
                // setTimeout(() => navigate("/dashboard"), 2000);
                // navigate("/dashboard");

                databases
                  .createDocument(
                    import.meta.env.VITE_DB_ID,
                    import.meta.env.VITE_DB_USER_ID,
                    user.$id,
                    {
                      email: values.email,
                    }
                  )
                  .then(
                    (response) => {
                      dispatch(loadingActions.setLoading(false));
                      toast({
                        title: "Mail Sent Successfully",
                        description:
                          "An email for verification has been sent to the provided email address.",
                        status: "success",
                        colorScheme: "teal",
                      });
                      reset();
                    },
                    (error) => {
                      dispatch(loadingActions.setLoading(false));
                      console.log(error);
                      toast({
                        title: "An error occured",
                        description: "Please provide valid inputs",
                        status: "error",
                        colorScheme: "red",
                      });
                    }
                  );
              },
              (error) => console.log(error)
            );
          },
          (error) => {
            dispatch(loadingActions.setLoading(false));
            console.log(error);
            toast({
              title: "An error occured",
              description: "Please provide valid inputs",
              status: "error",
              colorScheme: "red",
            });
          }
        );
      },
      (error) => {
        dispatch(loadingActions.setLoading(false));
        toast({
          title: "An error occured",
          description: "Please provide valid inputs",
          status: "error",
          colorScheme: "red",
        });
      }
    );
  }

  function signinUsingGoogleHandler() {
    dispatch(loadingActions.setLoading(true));
    account.createOAuth2Session(
      "google",
      "http://localhost:3000/verification",
      "http://localhost:3000/login"
    );

    dispatch(loadingActions.setLoading(false));
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

        <form onSubmit={handleSubmit(submitHandler)}>
          {/* email */}
          <Flex
            flexDir={"column"}
            gap={2}
            bgColor={"lightgray"}
            color={"whiteAlpha.900"}
            p={10}
            rounded={"xl"}
          >
            <FormControl isInvalid={errors.email}>
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
            </FormControl>

            {/* set password */}

            <FormControl isInvalid={errors.password}>
              <FormLabel htmlFor="password">Set Password</FormLabel>
              <Input
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
            <Button colorScheme="pink" width={"full"} type="submit" my={2}>
              Signup
            </Button>
            <Text textAlign={"center"}>Or</Text>

            {/* Google Signup button */}
            <Button
              colorScheme="blue"
              width={"full"}
              mb={4}
              onClick={signinUsingGoogleHandler}
            >
              Signin using Google
            </Button>

            {/* Link to Login */}

            <Text textAlign={"center"} fontSize={"large"}>
              Already a User?{" "}
              <Link
                as={RouteLink}
                to={"/login"}
                color={"teal.400"}
                fontWeight={"semibold"}
              >
                Login
              </Link>
            </Text>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
}

export default Signup;
