import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Box, Text } from '@chakra-ui/react';
import { memo } from 'react';
import { AnalysisComparisonDataPoint } from '../../utils/chartDataTransform';

interface AnalysisComparisonChartProps {
  data: AnalysisComparisonDataPoint[];
  isLoading?: boolean;
}

const colors = {
  ai: '#6366F1',
  manual: '#10B981',
};

function AnalysisComparisonChart({ data, isLoading = false }: AnalysisComparisonChartProps) {
  if (!isLoading && data.every((point) => point.aiInvalid === 0 && point.manualInvalid === 0)) {
    return (
      <Box textAlign="center" py={6} color="gray.500">
        <Text>No analysis data available for the current dataset.</Text>
      </Box>
    );
  }

  return (
    <Box height={{ base: 240, md: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="severity" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="aiInvalid" name="AI Invalid" fill={colors.ai} radius={[4, 4, 0, 0]} />
          <Bar dataKey="manualInvalid" name="Manual Invalid" fill={colors.manual} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default memo(AnalysisComparisonChart);
