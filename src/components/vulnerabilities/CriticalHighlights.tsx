import { Box, Text, VStack, HStack, Badge, Button, useColorModeValue } from '@chakra-ui/react';
import { FlattenedVulnerability } from '../../types/vulnerability';
import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface CriticalHighlightsProps {
  vulnerabilities: FlattenedVulnerability[];
  limit?: number;
}

export default function CriticalHighlights({ vulnerabilities, limit = 5 }: CriticalHighlightsProps) {
  const { criticalList, chartData, highestCvss } = useMemo(() => {
    const critical = vulnerabilities
      .filter((v) => v.severity.toLowerCase() === 'critical')
      .sort((a, b) => b.cvss - a.cvss)
      .slice(0, limit);

    const chart = critical
      .map((v) => ({ name: v.cve, cvss: v.cvss }))
      .reverse();

    const highest = critical.reduce((max, item) => Math.max(max, item.cvss), 0);

    return { criticalList: critical, chartData: chart, highestCvss: highest };
  }, [vulnerabilities, limit]);

  if (criticalList.length === 0) {
    return null;
  }

  return (
    <Box
      bg={useColorModeValue('red.50', 'rgba(254, 226, 226, 0.1)')}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={useColorModeValue('red.100', 'red.300')}
      p={6}
    >
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between" align="center">
          <Text fontWeight="bold" fontSize="lg" color={useColorModeValue('red.700', 'red.200')}>
            Critical Highlights
          </Text>
          <Badge colorScheme="red">
            {criticalList.length} critical {criticalList.length === 1 ? 'CVE' : 'CVEs'} highlighted
          </Badge>
        </HStack>

        <Box height={180}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
              <defs>
                <linearGradient id="colorCvss" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" angle={-30} textAnchor="end" height={60} tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} hide={true} />
              <Tooltip formatter={(value: number) => value.toFixed(1)} />
              <Area type="monotone" dataKey="cvss" stroke="#DC2626" fillOpacity={1} fill="url(#colorCvss)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <VStack align="stretch" spacing={2}>
          {criticalList.map((vuln) => (
            <HStack
              key={vuln.cve}
              justify="space-between"
              align="center"
              bg={useColorModeValue('white', 'gray.800')}
              borderWidth="1px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              borderRadius="md"
              p={3}
              shadow="sm"
            >
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold" color={useColorModeValue('blue.600', 'blue.200')}>
                  {vuln.cve}
                </Text>
                <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
                  {vuln.packageName} @ {vuln.packageVersion}
                </Text>
              </VStack>
              <HStack spacing={3} align="center">
                <Badge colorScheme="red">CVSS {vuln.cvss.toFixed(1)}</Badge>
                <Badge colorScheme="purple">Published {new Date(vuln.published).toLocaleDateString()}</Badge>
                <Button as={RouterLink} to={`/vulnerabilities/${encodeURIComponent(vuln.cve)}`} size="sm" colorScheme="blue">
                  View
                </Button>
              </HStack>
            </HStack>
          ))}
        </VStack>

        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
          Highest critical CVSS score: {highestCvss.toFixed(1)}
        </Text>
      </VStack>
    </Box>
  );
}
