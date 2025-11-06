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
import { useState } from 'react';
import { FilterState } from '../../hooks/useVulnerabilityFilters';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClear: () => void;
}

const severityOptions = ['critical', 'high', 'medium', 'low'];

function FilterPanel({ filters, onFilterChange, onClear }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const handleSeverityChange = (values: string[]) => {
    const newFilters = { ...localFilters, severity: values.length > 0 ? values : undefined };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePackageNameChange = (value: string) => {
    const newFilters = { ...localFilters, packageName: value || undefined };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const hasActiveFilters = Boolean(
    localFilters.severity?.length ||
    localFilters.packageName ||
    localFilters.kaiStatus?.length ||
    localFilters.excludeKaiStatus?.length
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
            value={localFilters.severity || []}
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
            value={localFilters.packageName || ''}
            onChange={(e) => handlePackageNameChange(e.target.value)}
          />
        </Box>
      </VStack>
    </Box>
  );
}

export default FilterPanel;

