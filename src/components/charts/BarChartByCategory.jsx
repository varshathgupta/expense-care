import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function BarChartByCategory  ({ data }) {
  const categoryTotals = Object.values(
    data.reduce((acc, item) => {
      acc[item.categoryId] = acc[item.categoryId] || { name: item.categoryId, amount: 0 };
      acc[item.categoryId].amount += item.amount;
      return acc;
    }, {})
  );

  console.log(categoryTotals)
  return (
    <BarChart width={500} height={400} data={categoryTotals}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis 
      dataKey="name" 
      interval={0} // Ensures all labels are shown
      tick={{ fontSize: 14 }} // Adjust font size if needed
      angle={-15} // Rotates labels to avoid overlap
      textAnchor="end" // Aligns rotated labels to the end
    />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="amount" fill="#82ca9d" />
  </BarChart>
  
  );
};
