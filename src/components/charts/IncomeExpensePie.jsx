import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#FF8042"]; // Colors for income and expense

export  function IncomeExpensePie  ({ data }) {
  const transformedData = [
    { name: "Income", value: data.filter(d => d.amountType === "income").reduce((a, b) => a + b.amount, 0) },
    { name: "Expense", value: data.filter(d => d.amountType === "expense").reduce((a, b) => a + b.amount, 0) },
  ];
  return (
    <PieChart width={200} height={300}>
      <Pie data={transformedData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
        {transformedData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};
