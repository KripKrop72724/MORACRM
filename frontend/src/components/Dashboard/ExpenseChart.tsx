import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box } from '@mui/material';

interface ExpenseChartProps {
  data: { month: string; total: number }[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
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
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`${label}`}</p>
          <p style={{ margin: 0, color: '#000000' }}>
            {`Total: $${payload[0].value.toFixed(2)}`}
          </p>
        </Box>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#666666' }}
          tickLine={{ stroke: '#E0E0E0' }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#666666' }}
          tickLine={{ stroke: '#E0E0E0' }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="total"
          fill="#000000"
          radius={[4, 4, 0, 0]}
          animationDuration={1000}
          animationBegin={200}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExpenseChart;