/**
 * KaiStatus distribution donut chart
 */

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { memo } from 'react';
import ChartContainer from './ChartContainer';
import { KaiStatusChartData } from '../../utils/chartDataTransform';

interface KaiStatusChartProps {
  data: KaiStatusChartData[];
  isLoading?: boolean;
}

const createCustomTooltip = (chartData: KaiStatusChartData[]) => {
  return ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      // Calculate total from all data points in the chart
      const total = chartData.reduce((sum, d) => sum + d.value, 0);
      const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
      
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '8px 12px',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {item.name}
          </p>
          <p style={{ color: item.payload.color }}>
            Count: {item.value.toLocaleString()}
          </p>
          <p style={{ color: '#666' }}>
            Percentage: {percentage}%
          </p>
        </div>
      );
    }
    return null;
  };
};

function KaiStatusChart({ data, isLoading = false }: KaiStatusChartProps) {
  if (data.length === 0 && !isLoading) {
    return (
      <ChartContainer title="Kai Status Distribution" isLoading={false} error="No data available">
        <div />
      </ChartContainer>
    );
  }

  return (
    <ChartContainer title="Kai Status Distribution" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value, percent }) => {
              // Only show label if percentage is significant
              if (percent < 0.05) return '';
              return `${name}: ${(percent * 100).toFixed(1)}%`;
            }}
            outerRadius={80}
            innerRadius={50}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={createCustomTooltip(data)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default memo(KaiStatusChart);

