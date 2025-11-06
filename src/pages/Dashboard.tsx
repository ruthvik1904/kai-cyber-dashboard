/**
 * Main dashboard page
 * Shows key metrics and visualizations
 */

import { Box, Heading, Text, VStack, SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { useVulnerabilityData } from '../hooks/useVulnerabilityData';
import SeverityDistributionChart from '../components/charts/SeverityDistributionChart';
import RiskFactorsChart from '../components/charts/RiskFactorsChart';
import VulnerabilityTrendChart from '../components/charts/VulnerabilityTrendChart';
import KaiStatusChart from '../components/charts/KaiStatusChart';
import {
  prepareSeverityData,
  prepareRiskFactorsData,
  prepareTrendData,
  prepareKaiStatusData,
} from '../utils/chartDataTransform';

function Dashboard() {
  const { vulnerabilities, metadata, isLoading, error } = useVulnerabilityData();

  if (isLoading) {
    return (
      <Box textAlign="center" py={12}>
        <Text>Loading vulnerability data...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={12}>
        <Text color="red.500">Error loading data: {error.message}</Text>
      </Box>
    );
  }

  // Prepare chart data
  const severityData = prepareSeverityData(vulnerabilities);
  const riskFactorsData = prepareRiskFactorsData(vulnerabilities, 15);
  const trendData = prepareTrendData(vulnerabilities);
  const kaiStatusData = prepareKaiStatusData(vulnerabilities);

  return (
    <VStack align="stretch" spacing={6}>
      <Box>
        <Heading size="xl" mb={2}>
          Security Vulnerability Dashboard
        </Heading>
        <Text color="gray.600">
          Overview of security vulnerabilities across the software ecosystem
        </Text>
      </Box>

      {/* Key Metrics */}
      {metadata && (
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <Stat bg="white" p={4} borderRadius="lg" shadow="md">
            <StatLabel>Total Vulnerabilities</StatLabel>
            <StatNumber>{metadata.totalCount.toLocaleString()}</StatNumber>
          </Stat>
          <Stat bg="white" p={4} borderRadius="lg" shadow="md">
            <StatLabel>Groups</StatLabel>
            <StatNumber>{metadata.totalGroups}</StatNumber>
          </Stat>
          <Stat bg="white" p={4} borderRadius="lg" shadow="md">
            <StatLabel>Repositories</StatLabel>
            <StatNumber>{metadata.totalRepos}</StatNumber>
          </Stat>
          <Stat bg="white" p={4} borderRadius="lg" shadow="md">
            <StatLabel>Images</StatLabel>
            <StatNumber>{metadata.totalImages}</StatNumber>
          </Stat>
        </SimpleGrid>
      )}

      {/* Charts Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <SeverityDistributionChart data={severityData} isLoading={isLoading} />
        <RiskFactorsChart data={riskFactorsData} isLoading={isLoading} />
        <VulnerabilityTrendChart data={trendData} isLoading={isLoading} />
        <KaiStatusChart data={kaiStatusData} isLoading={isLoading} />
      </SimpleGrid>
    </VStack>
  );
}

export default Dashboard;

