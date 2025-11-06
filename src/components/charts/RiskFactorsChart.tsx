/**
 * Risk factors frequency horizontal bar chart
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { memo } from 'react';
import ChartContainer from './ChartContainer';
import { RiskFactorChartData } from '../../utils/chartDataTransform';

interface RiskFactorsChartProps {
  data: RiskFactorChartData[];
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '8px 12px',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          {data.payload.name}
        </p>
        <p style={{ color: '#3B82F6' }}>
          Count: {data.value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

function RiskFactorsChart({ data, isLoading = false }: RiskFactorsChartProps) {
  if (data.length === 0 && !isLoading) {
    return (
      <ChartContainer title="Top Risk Factors" isLoading={false} error="No data available">
        <div />
      </ChartContainer>
    );
  }

  return (
    <ChartContainer title="Top Risk Factors" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            dataKey="name"
            type="category"
            width={150}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default memo(RiskFactorsChart);

