import React from "react";
import { categories } from "../../pages/Dashboard";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Container, Flex, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import  expenses  from "../../assets/MOCK_DATA.json";


export const COLORS = [
  "#319795",
  "#3182CE",
  "#D69E2E",
  "#E53E3E",
  "#DD6B20",
  "#D53F8C",
];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{ textAlign: "center" }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function ExpensePieChart() {
  const data = [
    { category: 'VBS', total: 37200 },
    { category: 'Christmas', total: 25000 },  // Update with real values
    { category: 'Miscellaneous', total: 12000 }
  ];
  const payload = data.map((item) => item.category);

  if (data.length === 0) {
    return (
      <>
        <Text textAlign={"center"}>No data to display Pie Chart</Text>
      </>
    );
  }

  return (
    <>
      <Flex display={{ base: "none", md: "flex" }}>
        <PieChart height={500} width={500}>
          <Pie
            data={data}
            cx={250}
            cy={250}
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={200}
            fill="#8884d8"
            dataKey="total"
            nameKey="category"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip payload={data} />
        </PieChart>
      </Flex>

      <Flex display={{ base: "flex", md: "none" }}>
        <PieChart height={325} width={325}>
          <Pie
            data={data}
            cx={162}
            cy={162}
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={150}
            fill="#8884d8"
            dataKey="expense"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip payload={data} />
        </PieChart>
      </Flex>
    </>
  );
}

export default ExpensePieChart;
