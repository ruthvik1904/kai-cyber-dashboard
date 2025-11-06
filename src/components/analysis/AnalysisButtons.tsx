/**
 * Enhanced Analysis and AI Analysis buttons with visual improvements
 */

import { HStack, Button, Text, Box, Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useVulnerabilityFilters } from '../../hooks/useVulnerabilityFilters';

const MotionButton = motion(Button);

function AnalysisButtons() {
  const {
    applyAnalysis,
    applyAIAnalysis,
    clearFilters,
    filters,
    isLoading,
  } = useVulnerabilityFilters();

  const isAnalysisActive = filters.excludeKaiStatus?.includes('invalid - norisk');
  const isAIAnalysisActive = filters.excludeKaiStatus?.includes('ai-invalid-norisk');

  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="md">
      <Text fontWeight="bold" fontSize="lg" mb={4}>
        Analysis Tools
      </Text>
      <HStack spacing={4} mb={4}>
        <Tooltip
          label="Filters out CVEs with kaiStatus 'invalid - norisk'"
          hasArrow
        >
          <MotionButton
            colorScheme="blue"
            onClick={applyAnalysis}
            isDisabled={isLoading}
            isActive={isAnalysisActive}
            size="lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            Analysis
          </MotionButton>
        </Tooltip>
        <Tooltip
          label="Filters out CVEs with kaiStatus 'ai-invalid-norisk'"
          hasArrow
        >
          <MotionButton
            colorScheme="purple"
            onClick={applyAIAnalysis}
            isDisabled={isLoading}
            isActive={isAIAnalysisActive}
            size="lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            AI Analysis
          </MotionButton>
        </Tooltip>
        {(filters.excludeKaiStatus?.length ?? 0) > 0 && (
          <Button variant="outline" onClick={clearFilters} size="lg">
            Clear Filters
          </Button>
        )}
      </HStack>
      <Text fontSize="sm" color="gray.600">
        Use Analysis tools to filter out vulnerabilities marked as invalid or no-risk.
      </Text>
    </Box>
  );
}

export default AnalysisButtons;

