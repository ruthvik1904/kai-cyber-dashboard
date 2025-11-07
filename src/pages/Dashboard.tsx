/**
 * Main dashboard page
 * Shows key metrics and visualizations
 */

import { Box, Heading, Text, VStack, SimpleGrid, Stat, StatLabel, StatNumber, useColorModeValue } from '@chakra-ui/react';
import { useVulnerabilityData } from '../hooks/useVulnerabilityData';
import SeverityDistributionChart from '../components/charts/SeverityDistributionChart';
import RiskFactorsChart from '../components/charts/RiskFactorsChart';
import VulnerabilityTrendChart from '../components/charts/VulnerabilityTrendChart';
import KaiStatusChart from '../components/charts/KaiStatusChart';
import AnalysisComparisonChart from '../components/charts/AnalysisComparisonChart';
import {
  prepareSeverityData,
  prepareRiskFactorsData,
  prepareTrendData,
  prepareKaiStatusData,
  prepareAnalysisComparisonData,
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
  const analysisComparisonData = prepareAnalysisComparisonData(vulnerabilities);
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const mutedText = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <VStack align="stretch" spacing={{ base: 6, md: 8 }}>
      <Box>
        <Heading size={{ base: 'lg', md: 'xl' }} mb={2} color={headingColor}>
          Security Vulnerability Dashboard
        </Heading>
        <Text color={mutedText} fontSize={{ base: 'sm', md: 'md' }}>
          Overview of security vulnerabilities across the software ecosystem
        </Text>
      </Box>

      {/* Key Metrics */}
      {metadata && (
        <SimpleGrid columns={{ base: 2, sm: 2, md: 4 }} spacing={{ base: 3, md: 4 }}>
          <Stat bg={cardBg} borderWidth="1px" borderColor={cardBorder} p={4} borderRadius="lg" shadow="md">
            <StatLabel color={mutedText}>Total Vulnerabilities</StatLabel>
            <StatNumber>{metadata.totalCount.toLocaleString()}</StatNumber>
          </Stat>
          <Stat bg={cardBg} borderWidth="1px" borderColor={cardBorder} p={4} borderRadius="lg" shadow="md">
            <StatLabel color={mutedText}>Groups</StatLabel>
            <StatNumber>{metadata.totalGroups}</StatNumber>
          </Stat>
          <Stat bg={cardBg} borderWidth="1px" borderColor={cardBorder} p={4} borderRadius="lg" shadow="md">
            <StatLabel color={mutedText}>Repositories</StatLabel>
            <StatNumber>{metadata.totalRepos}</StatNumber>
          </Stat>
          <Stat bg={cardBg} borderWidth="1px" borderColor={cardBorder} p={4} borderRadius="lg" shadow="md">
            <StatLabel color={mutedText}>Images</StatLabel>
            <StatNumber>{metadata.totalImages}</StatNumber>
          </Stat>
        </SimpleGrid>
      )}

      {/* Charts Grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
        <SeverityDistributionChart data={severityData} isLoading={isLoading} />
        <RiskFactorsChart data={riskFactorsData} isLoading={isLoading} />
        <VulnerabilityTrendChart data={trendData} isLoading={isLoading} />
        <KaiStatusChart data={kaiStatusData} isLoading={isLoading} />
      </SimpleGrid>

      <Box bg={cardBg} borderWidth="1px" borderColor={cardBorder} p={{ base: 4, md: 6 }} borderRadius="lg" shadow="md">
        <Heading size="md" mb={4} color={headingColor} textAlign="center">
          AI vs Manual Analysis
        </Heading>
        <Text color={mutedText} fontSize={{ base: 'sm', md: 'md' }} mb={4} textAlign="center">
          Compare how AI (Kai status) and manual adjudication categorize vulnerabilities across severity levels.
        </Text>
        <AnalysisComparisonChart data={analysisComparisonData} isLoading={isLoading} />
      </Box>
    </VStack>
  );
}

export default Dashboard;

