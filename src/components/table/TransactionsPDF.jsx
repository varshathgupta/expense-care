import { useRef, useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import PropTypes from "prop-types";
import { listFilteredExpenses } from "../../store/data-actions";

const TransactionsPDF = ({ filteredTransactions }) => {
  const pdfRef = useRef();
  const [openingBalance, setOpeningBalance] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);
  const searchItemStartDate = localStorage.getItem("searchStartDate");

  // Utility to calculate previous month dates
  const calculatePrevMonthDates = (startDate) => {
    const newMonthDate = new Date(startDate);
    newMonthDate.setMonth(newMonthDate.getMonth() - 1);

    const firstDay = newMonthDate.toISOString().split("T")[0];
    const lastDay = new Date(newMonthDate.getFullYear(), newMonthDate.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    return { firstDay, lastDay };
  };

  // Utility to calculate totals
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

  // Fetch previous month filtered expenses
  const fetchPrevMonthFilteredExpenses = async () => {
    try {
    
      if (!searchItemStartDate) throw new Error("Start date not found in localStorage.");

      const { firstDay, lastDay } = calculatePrevMonthDates(searchItemStartDate);
      const prevMonthData = await listFilteredExpenses(null, firstDay, lastDay, null);

      if (prevMonthData.length) {
        const { totalDebit, totalCredit } = calculateTotals(prevMonthData);
        const netBalance = totalCredit - totalDebit;
        setOpeningBalance(netBalance);
      }
    } catch (error) {
      console.error("Error fetching previous month's expenses:", error);
    }
  };

  useEffect(() => {
    console.log(searchItemStartDate)
    if(searchItemStartDate !== null && searchItemStartDate !== undefined) {
      fetchPrevMonthFilteredExpenses();
    }
  }, [searchItemStartDate]);

  // Calculate closing balance
  useEffect(() => {
    const { totalDebit, totalCredit } = calculateTotals(filteredTransactions);
    setClosingBalance(openingBalance + totalCredit - totalDebit);
  }, [filteredTransactions, openingBalance]);

  const getFileName = () => {
    const timestamp = new Date().getTime();
    return `transaction_report_${timestamp}`;
  };

  const options = {
    resolution: Resolution.HIGH,
    filename: getFileName(),
    page: { margin: Margin.LARGE },
    canvas: { qualityRatio: 1 },
    overrides: {
      pdf: { compress: true },
      canvas: { useCORS: true },
    },
  };

  const handleDownload = () => {
    generatePDF(pdfRef, options);
  };
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  // Styles
  const styles = {
    pdfContainer: {
      position: "absolute",
      top: "-10000px",
      left: "-10000px",
    },
    header: {
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "16px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    thTd: {
      border: "1px solid black",
      padding: "8px",
    },
    rightAlign: {
      textAlign: "right",
    },
    centerAlign:{
      textAlign: "center",
    },
    totalRow: {
      fontWeight: "bold",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "1rem",
      marginRight: "4.5rem",
    },
  };

  return (
    <>
      {/* Hidden content for PDF generation */}
      <div style={styles.pdfContainer}>
        <div ref={pdfRef} style={{ color: "#333" }}>
          <h1 style={styles.header}>Transactions Summary</h1>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.thTd}>Date</th>
                <th style={styles.thTd}>Name</th>
                <th style={styles.thTd}>Description</th>
                <th style={styles.thTd}>Credit Amount (Rs.)</th>
                <th style={styles.thTd}>Debit Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" style={{ ...styles.thTd, ...styles.totalRow }}>Opening Balance</td>
                <td colSpan="2" style={{ ...styles.thTd, ...styles.totalRow, ...styles.centerAlign }}>
                  {openingBalance}
                </td>
              </tr>
              {sortedTransactions.map((transaction) => (
                <tr key={transaction.$id}>
                  <td style={styles.thTd}>
                    {new Date(transaction.date).toLocaleDateString("en-GB")}
                  </td>
                  <td style={styles.thTd}>{transaction.name}</td>
                  <td style={styles.thTd}>{transaction.description}</td>
                  <td style={{ ...styles.thTd, ...styles.rightAlign }}>
                    {transaction.amountType === "income" ? transaction.amount : 0}
                  </td>
                  <td style={{ ...styles.thTd, ...styles.rightAlign }}>
                    {transaction.amountType === "expense" ? transaction.amount : 0}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" style={{ ...styles.thTd, ...styles.totalRow }}>Total</td>
                <td style={{ ...styles.thTd, ...styles.totalRow, ...styles.rightAlign }}>
                  {filteredTransactions.reduce(
                    (acc, transaction) =>
                      transaction.amountType === "income" ? acc + transaction.amount : acc,
                    0
                  )}
                </td>
                <td style={{ ...styles.thTd, ...styles.totalRow, ...styles.rightAlign }}>
                  {filteredTransactions.reduce(
                    (acc, transaction) =>
                      transaction.amountType === "expense" ? acc + transaction.amount : acc,
                    0
                  )}
                </td>
              </tr>
              <tr>
                <td colSpan="3" style={{ ...styles.thTd, ...styles.totalRow }}>Closing Balance</td>
                <td colSpan="2" style={{ ...styles.thTd, ...styles.totalRow, ...styles.centerAlign }}>
                  {closingBalance}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Visible button for downloading PDF */}
      <div style={styles.buttonContainer}>
        <Button colorScheme="pink" maxW="225px" px="2%" onClick={handleDownload}>
          Download Summary
        </Button>
      </div>
    </>
  );
};

// Define PropTypes
TransactionsPDF.propTypes = {
  filteredTransactions: PropTypes.array.isRequired,
};

export default TransactionsPDF;
