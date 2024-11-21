import  { useRef } from "react";
import { Button } from "@chakra-ui/react";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import PropTypes from 'prop-types';

function TransactionsPDF({ filteredTransactions }) {
  const pdfRef = useRef();

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
                  Name
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Credit Amount (Rs.)
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Debit Amount (Rs.)
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.$id}>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {transaction.name}
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
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {new Date(transaction.date).toLocaleDateString("en-GB")}
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
