import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function LineChartTrends ({ data }) {
  const sortedData = data
    .map(d => ({ ...d, date: new Date(d.date) }))
    .sort((a, b) => a.date - b.date);

  return (
    <LineChart width={400} height={300} data={sortedData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" tickFormatter={(tick) => tick.toLocaleDateString()} />
      <YAxis />
      <Tooltip labelFormatter={(label) => label.toLocaleDateString()} />
      <Legend />
      <Line type="monotone" dataKey="amount" stroke="#8884d8" />
    </LineChart>
  );
};
