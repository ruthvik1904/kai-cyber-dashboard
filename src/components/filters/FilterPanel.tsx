/**
 * Advanced filter panel component
 */

import {
  Box,
  VStack,
  HStack,
  Text,
  Checkbox,
  CheckboxGroup,
  Select,
  Input,
  Button,
} from '@chakra-ui/react';
import { FilterState } from '../../hooks/useVulnerabilityFilters';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClear: () => void;
}

const severityOptions = ['critical', 'high', 'medium', 'low'];

function FilterPanel({ filters, onFilterChange, onClear }: FilterPanelProps) {
  const handleSeverityChange = (values: string[]) => {
    const newFilters = { ...filters, severity: values.length > 0 ? values : undefined };
    onFilterChange(newFilters);
  };

  const handlePackageNameChange = (value: string) => {
    const newFilters = { ...filters, packageName: value || undefined };
    onFilterChange(newFilters);
  };

  const hasActiveFilters = Boolean(
    filters.severity?.length ||
    filters.packageName ||
    filters.kaiStatus?.length ||
    filters.excludeKaiStatus?.length
  );

  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="md">
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <Text fontWeight="bold" fontSize="lg">
            Filters
          </Text>
          {hasActiveFilters && (
            <Button size="sm" variant="ghost" onClick={onClear}>
              Clear All
            </Button>
          )}
        </HStack>

        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Severity
          </Text>
          <CheckboxGroup
            value={filters.severity || []}
            onChange={handleSeverityChange}
          >
            <VStack align="start" spacing={2}>
              {severityOptions.map((severity) => (
                <Checkbox key={severity} value={severity}>
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Package Name
          </Text>
          <Input
            placeholder="Filter by package name..."
            value={filters.packageName || ''}
            onChange={(e) => handlePackageNameChange(e.target.value)}
          />
        </Box>
      </VStack>
    </Box>
  );
}

export default FilterPanel;

