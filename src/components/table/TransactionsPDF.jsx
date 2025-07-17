import { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import PropTypes from "prop-types";
import { listFilteredExpenses } from "../../store/data-actions";

const TransactionsPDF = ({ filteredTransactions }) => {
  const [openingBalance, setOpeningBalance] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);
  const[loading,setLoading] = useState(false)
  const searchItemStartDate = localStorage.getItem("searchStartDate");

  // Utility to calculate previous month dates
  function getFinancialYearDates(startDate) {
    const date = new Date(startDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JS months are 0-based

    let firstYear = month >= 4 ? year : year - 1;
    let firstDay = new Date(firstYear, 3, 1); // April 1st of the financial year

    let lastDay;
    if (month === 4) {
        lastDay = new Date(firstYear, 3, 30); // April 30th of the same year
    } else {
        lastDay = new Date(date.getFullYear(), date.getMonth(), 0); // Last day of the previous month
    }

    return {
        firstDay: `${firstDay.getFullYear()}-${(firstDay.getMonth() + 1).toString().padStart(2, '0')}-01`,
        lastDay: `${lastDay.getFullYear()}-${(lastDay.getMonth() + 1).toString().padStart(2, '0')}-${lastDay.getDate()}`
    };
}
  

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
      if(searchItemStartDate.includes('04-01') ) {
        setOpeningBalance(0);
        return;
      }else{
        const { firstDay, lastDay } = getFinancialYearDates(searchItemStartDate);
        const prevMonthData = await listFilteredExpenses(null, firstDay, lastDay, null);
        if (prevMonthData.length) {
          const { totalDebit, totalCredit } = calculateTotals(prevMonthData);
          const netBalance = totalCredit - totalDebit;
          setOpeningBalance(netBalance);
        }
      }
    } catch (error) {
      console.error("Error fetching previous month's expenses:", error);
    }
  };

  useEffect(() => {
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
  
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Generate PDF using jsPDF and jsPDF-autotable
  const handleDownload = () => {
    setLoading(true);
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text("Transactions Summary", doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
      doc.setFontSize(10);
      
      let currentY = 25;

      // Opening balance row
      const openingBalanceTable = autoTable(doc, {
        head: [['Opening Balance', '  ', '  ', '  ', openingBalance.toString()]],
        startY: currentY,
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        theme: 'grid',
        columnStyles: {
          0: { cellWidth: 'auto' },
          4: { halign: 'center', cellWidth: 40 }
        },
        margin: { top: currentY }
      });

      // Update current Y position
      currentY = (openingBalanceTable && openingBalanceTable.finalY) ? openingBalanceTable.finalY + 5 : currentY +20;
      
      // Transactions table
      const tableHeaders = [['Date', 'Remarks', 'Description', 'Credit (Rs.)', 'Debit (Rs.)']];
      
      // Transform transactions data for the table
      const tableData = sortedTransactions.map(transaction => [
        new Date(transaction.date).toLocaleDateString('en-GB'),
        transaction.name,
        transaction.description,
        transaction.amountType === 'income' ? transaction.amount.toString() : '0',
        transaction.amountType === 'expense' ? transaction.amount.toString() : '0'
      ]);
      
      // Calculate total credit and debit
      const totalCredit = filteredTransactions.reduce(
        (acc, transaction) => transaction.amountType === 'income' ? acc + transaction.amount : acc, 
        0
      );
      const totalDebit = filteredTransactions.reduce(
        (acc, transaction) => transaction.amountType === 'expense' ? acc + transaction.amount : acc, 
        0
      );

      // Combine transaction data with totals
      const allTableData = [
        ...tableData,
        ['', '', '', '', ''], // Empty row for spacing
        ['Total', '', '', totalCredit.toString(), totalDebit.toString()],
        ['Closing Balance', '', '', '', closingBalance.toString()]
      ];

      // Generate complete table with transactions and totals
      autoTable(doc, {
        head: tableHeaders,
        body: allTableData,
        startY: currentY,
        theme: 'grid',
        columnStyles: {
          0: { cellWidth: 25 },
          3: { halign: 'right' },
          4: { halign: 'right' }
        },
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        didDrawPage: () => {
          // Header on each page
          doc.setFontSize(10);
          doc.text("", doc.internal.pageSize.getWidth() / 2, 10, { align: 'center' });
        },
        styles: {
          cellPadding: 2,
          fontSize: 10
        },
        // Style the total and closing balance rows
        didParseCell: function(data) {
          const row = data.row.raw[0];
          if (row === 'Total' || row === 'Closing Balance') {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [240, 240, 240];
            data.cell.styles.textColor = [0, 0, 0];
          }
        }
      });
      
      // Save the PDF
      doc.save(getFileName() + '.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "1rem",
    marginRight: "4.5rem",
  };

  return (
    <div style={buttonContainerStyle}>
      <Button colorScheme="pink" maxW="225px" px="2%" onClick={handleDownload} disabled={loading}>
        {loading ? 'Loading' : 'Download Summary'} 
      </Button>
    </div>
  );
};

// Define PropTypes
TransactionsPDF.propTypes = {
  filteredTransactions: PropTypes.array.isRequired,
};

export default TransactionsPDF;
