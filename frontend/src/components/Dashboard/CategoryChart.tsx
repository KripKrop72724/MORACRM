import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Box } from '@mui/material';

interface CategoryChartProps {
  data: { category: string; total: number }[];
}

const COLORS = ['#000000', '#333333', '#666666', '#999999', '#BBBBBB', '#DDDDDD'];

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold' }}>{data.payload.category}</p>
          <p style={{ margin: 0, color: data.color }}>
            {`Amount: $${data.value.toFixed(2)}`}
          </p>
        </Box>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={<CustomLabel />}
          outerRadius={80}
          fill="#8884d8"
          dataKey="total"
          animationBegin={0}
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{
            fontSize: '12px',
            paddingTop: '20px',
          }}
          formatter={(value, entry) => (
            <span style={{ color: entry.color }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryChart;