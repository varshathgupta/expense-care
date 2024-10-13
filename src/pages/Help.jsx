import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import React from "react";
import Header from "../components/Header";

const faqs = [
  {
    question: "How to signup to use the application ?",
    answer:
      "Signup can be done in two ways i.e. either by providing email address which further will be verified or by using google sign in option",
  },
  {
    question: "What does the application offers ?",
    answer:
      "A Simple way to keep an eye on your expenses by providing a very intuitive UI and a very easy and quick way to add your expenses on daily basis. The application also provides the visualisation of the data entered in form of bar graph and pie chart",
  },
  {
    question: "How to use the application ?",
    answer:
      "To start using the application, create categories like Groceries, Travel etc. and your regular expenses in an easay manner into those categories and you will be able to view your expenses in a consolidated way whenever you want",
  },
  {
    question: "Can a Expense be modified after creation ?",
    answer:
      "Yes, currently an expense can be edited and delted by going the all expense page and selecting the particular expense and in real time all the data which needs to be changed due to that modification will happen instantly",
  },
  {
    question:
      "What kind of expense filtering and sorting options are available ?",
    answer:
      "Expenses can be filtered basis on category, year, and month or any comibination of these. And expenses can be sorted as per created date or amount",
  },
  {
    question: "How to view bar graph and pie chart on expense page ?",
    answer:
      'To view bar graph and pie chart, select the year and month in the filter and click "Show Charts" button, if any data as per the filter is present, the graph and chart will get created',
  },
];

function Help() {
  return (
    <>
      <Flex flexDir={"column"} w={"100vw"}>
        <Header />
        <Text my={"2rem"} mx={"auto"} fontSize={"4xl"} textColor={"blue.500"}>
          FAQs
        </Text>
        <Accordion allowToggle mx={{ base: "2rem", md: "4rem" }} py={"2rem"}>
          {faqs.map((faq) => (
            <AccordionItem pb={"1rem"}>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    <Text fontSize={"large"}> {faq.question} </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={2}>
                <Text fontStyle={"italic"} fontSize={"md"}>
                  {faq.answer}
                </Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Flex>
    </>
  );
}

export default Help;
