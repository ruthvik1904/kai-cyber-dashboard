/**
 * Severity distribution pie chart
 */

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { memo } from 'react';
import ChartContainer from './ChartContainer';
import { SeverityChartData } from '../../utils/chartDataTransform';

interface SeverityDistributionChartProps {
  data: SeverityChartData[];
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const total = data.payload.payload.total || data.value;
    const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0';
    
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '8px 12px',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          {data.name}
        </p>
        <p style={{ color: data.color }}>
          Count: {data.value.toLocaleString()}
        </p>
        <p style={{ color: '#666' }}>
          Percentage: {percentage}%
        </p>
      </div>
    );
  }
  return null;
};

function SeverityDistributionChart({
  data,
  isLoading = false,
}: SeverityDistributionChartProps) {
  if (data.length === 0 && !isLoading) {
    return (
      <ChartContainer title="Severity Distribution" isLoading={false} error="No data available">
        <div />
      </ChartContainer>
    );
  }

  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartContainer title="Severity Distribution" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default memo(SeverityDistributionChart);

