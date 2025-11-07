/**
 * Visual representation of filter impact
 * Shows before/after counts with animated transitions
 */

import { Box, HStack, VStack, Text, Progress, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FilterState, FilterStats } from '../../hooks/useVulnerabilityFilters';

const MotionBox = motion(Box);

function FilterImpactVisualization({ filters, filterStats }: { filters: FilterState; filterStats: FilterStats; }) {
  const hasActiveFilters = (filters.excludeKaiStatus?.length ?? 0) > 0;

  const filteredPercentage =
    filterStats.total > 0
      ? (filterStats.filtered / filterStats.total) * 100
      : 0;
  const excludedPercentage =
    filterStats.total > 0 ? (filterStats.excluded / filterStats.total) * 100 : 0;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      p={6}
      borderRadius="lg"
      shadow="md"
    >
      <Text fontWeight="bold" fontSize="lg" mb={4} color={useColorModeValue('gray.700', 'gray.200')}>
        Filter Impact
      </Text>
      <VStack align="stretch" spacing={4}>
        <HStack spacing={6}>
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
              Total
            </Text>
            <MotionBox
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Text fontSize="2xl" fontWeight="bold">
                {filterStats.total.toLocaleString()}
              </Text>
            </MotionBox>
          </VStack>
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
              Filtered
            </Text>
            <MotionBox
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {filterStats.filtered.toLocaleString()}
              </Text>
            </MotionBox>
          </VStack>
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
              Excluded
            </Text>
            <MotionBox
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                {filterStats.excluded.toLocaleString()}
              </Text>
            </MotionBox>
          </VStack>
        </HStack>

        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
              Filtered: {filteredPercentage.toFixed(1)}%
            </Text>
            <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
              Excluded: {excludedPercentage.toFixed(1)}%
            </Text>
          </HStack>
          <Progress
            value={filteredPercentage}
            colorScheme="blue"
            size="lg"
            borderRadius="full"
            bg="gray.200"
          />
        </Box>
      </VStack>
    </Box>
  );
}

export default FilterImpactVisualization;

