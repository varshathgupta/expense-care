import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function BarChartByCategory  ({ data }) {
  const categoryTotals = Object.values(
    data.reduce((acc, item) => {
      acc[item.categoryId] = acc[item.categoryId] || { name: item.categoryId, amount: 0 };
      acc[item.categoryId].amount += item.amount;
      return acc;
    }, {})
  );

  return (
    <BarChart width={400} height={300} data={categoryTotals}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="amount" fill="#82ca9d" />
    </BarChart>
  );
};
