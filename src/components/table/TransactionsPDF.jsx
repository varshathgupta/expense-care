import  {  useRef, useState } from "react";
import { Button } from "@chakra-ui/react";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import PropTypes from 'prop-types';
import { listFilteredExpenses } from "../../store/data-actions";

function TransactionsPDF({ filteredTransactions }) {
  const pdfRef = useRef();
  const[openingBalance,setOpeningBalance]=useState(0)



  const fetchPrevMonthFilteredExpenses = async () => {
    try {
      // Get the start date from localStorage and calculate new month dates
      const searchItemStartDate = localStorage.getItem("filteredTransactions");
      if (!searchItemStartDate) throw new Error("Start date not found in localStorage.");
  
      const { firstDay, lastDay } = calculatePrevMonthDates(searchItemStartDate);
  
      // Fetch previous month's filtered expenses
      const prevMonthData = await listFilteredExpenses(null, firstDay, lastDay, null);
  
      if (prevMonthData.length) {
        // Calculate totals for debit (expense) and credit (income)
        const totals = calculateTotals(prevMonthData);
        const netBalance = totals.totalCredit - totals.totalDebit;
  
        // Set the opening balance
        setOpeningBalance(netBalance);
      }
    } catch (error) {
      console.error("Error fetching previous month's expenses:", error);
    }
  };
  
  // Utility function to calculate the first and last day of the previous month
  const calculatePrevMonthDates = (startDate) => {
    const newMonthDate = new Date(startDate);
    newMonthDate.setMonth(newMonthDate.getMonth() - 1);
  
    // First day of the new month
    const firstDay = newMonthDate.toISOString().split("T")[0];
  
    // Last day of the new month
    const lastDay = new Date(newMonthDate.getFullYear(), newMonthDate.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
  
    return { firstDay, lastDay };
  };
  
  // Utility function to calculate totals
  const calculateTotals = (transactions) => {
    return transactions.reduce(
      (totals, transaction) => {
        if (transaction.amountType === "expense") {
          totals.totalDebit += transaction.amount;
        } else if (transaction.amountType === "income") {
          totals.totalCredit += transaction.amount;
        }
        return totals;
      },
      { totalDebit: 0, totalCredit: 0 }
    );
  };
  
  const totalDebit = filteredTransactions.reduce(
    (acc, transaction) =>
      transaction.amountType === "expense" ? acc + transaction.amount : acc,
    0
  );

  const totalCredit = filteredTransactions.reduce(
    (acc, transaction) =>
      transaction.amountType === "income" ? acc + transaction.amount : acc,
    0
  );
  const getFileName = () => {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    return `transaction_report_${timestamp}`;
  };
  const options = {
    resolution: Resolution.HIGH,
    filename: getFileName(),
    page: {
      margin: Margin.LARGE,
    },
    canvas: {
      qualityRatio: 1,
    },
    overrides: {
      pdf: {
        compress: true,
      },
      canvas: {
        useCORS: true,
      },
    },
  };
  const handleDownload = () => {
    fetchPrevMonthFilteredExpenses()
    generatePDF(pdfRef, options);
  };
  TransactionsPDF.propTypes = {
    filteredTransactions: PropTypes.array.isRequired,
   
  };

  return (
    <>
      {/* Invisible content for PDF generation */}
      <div
        style={{
          position: "absolute",
          top: "-10000px", // Move the element far out of view
          left: "-10000px",
        }}
      >
        <div ref={pdfRef} style={{ color: "#333" }}>
          <h1
            style={{
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            Transactions Summary
          </h1>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                  Date
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Name
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Description
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Credit Amount (Rs.)
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Debit Amount (Rs.)
                </th>
              
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.$id}>
                   <td style={{ border: "1px solid black", padding: "8px" }}>
                    {new Date(transaction.date).toLocaleDateString("en-GB")}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {transaction.name}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {transaction.description}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "right",
                    }}
                  >
                    {transaction.amountType === "income"
                      ? transaction.amount
                      : 0}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "right",
                    }}
                  >
                    {transaction.amountType === "expense"
                      ? transaction.amount
                      : 0}
                  </td>
                 
                </tr>
              ))}
              <tr>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Total
                </td>
                <td  style={{
                    border: "1px solid black",
                    padding: "8px",
                    fontWeight: "bold",
                    textAlign: "right",
                  }}></td>
                <td  style={{
                    border: "1px solid black",
                    padding: "8px",
                    fontWeight: "bold",
                    textAlign: "right",
                  }}></td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  {totalCredit}
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  {totalDebit}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Visible button for downloading PDF */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <Button
          colorScheme="pink"
          maxW="225px"
          px="2%"
          onClick={handleDownload}
          marginRight={"4.5rem"}
        >
          Download Summary
        </Button>
      </div>
    </>
  );
}

export default TransactionsPDF;
