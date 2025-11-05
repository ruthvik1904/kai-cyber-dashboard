/**
 * Main dashboard page
 * Shows key metrics and visualizations
 */

import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { useVulnerabilityData } from '../hooks/useVulnerabilityData';

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

      {/* Key Metrics - Placeholder for Phase 3 */}
      <Box bg="white" p={6} borderRadius="lg" shadow="md">
        <Heading size="md" mb={4}>
          Key Metrics
        </Heading>
        {metadata && (
          <VStack align="stretch" spacing={3}>
            <Text>
              <strong>Total Vulnerabilities:</strong> {metadata.totalCount.toLocaleString()}
            </Text>
            <Text>
              <strong>Groups:</strong> {metadata.totalGroups}
            </Text>
            <Text>
              <strong>Repositories:</strong> {metadata.totalRepos}
            </Text>
            <Text>
              <strong>Images:</strong> {metadata.totalImages}
            </Text>
            <Text>
              <strong>Severity Distribution:</strong>
            </Text>
            <Box pl={4}>
              <Text>Critical: {metadata.severityDistribution.critical}</Text>
              <Text>High: {metadata.severityDistribution.high}</Text>
              <Text>Medium: {metadata.severityDistribution.medium}</Text>
              <Text>Low: {metadata.severityDistribution.low}</Text>
            </Box>
          </VStack>
        )}
      </Box>

      {/* Visualizations - Placeholder for Phase 3 */}
      <Box bg="white" p={6} borderRadius="lg" shadow="md">
        <Heading size="md" mb={4}>
          Visualizations
        </Heading>
        <Text color="gray.500">
          Charts and graphs will be added in Phase 3
        </Text>
      </Box>
    </VStack>
  );
}

export default Dashboard;

