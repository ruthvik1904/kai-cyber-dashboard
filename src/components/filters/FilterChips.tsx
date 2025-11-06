/**
 * Display active filters as removable chips
 */

import { HStack, Badge, IconButton, Box, Text } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { FilterState } from '../../hooks/useVulnerabilityFilters';

interface FilterChipsProps {
  filters: FilterState;
  onRemoveFilter: (key: keyof FilterState) => void;
}

function FilterChips({ filters, onRemoveFilter }: FilterChipsProps) {
  const chips: Array<{ key: keyof FilterState; label: string; value: string }> = [];

  if (filters.severity?.length) {
    filters.severity.forEach((severity) => {
      chips.push({
        key: 'severity',
        label: 'Severity',
        value: severity,
      });
    });
  }

  if (filters.packageName) {
    chips.push({
      key: 'packageName',
      label: 'Package',
      value: filters.packageName,
    });
  }

  if (filters.excludeKaiStatus?.length) {
    filters.excludeKaiStatus.forEach((status) => {
      chips.push({
        key: 'excludeKaiStatus',
        label: 'Excluding',
        value: status,
      });
    });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <Box>
      <Text fontSize="sm" fontWeight="medium" mb={2}>
        Active Filters:
      </Text>
      <HStack spacing={2} flexWrap="wrap">
        {chips.map((chip, index) => (
          <Badge
            key={`${chip.key}-${chip.value}-${index}`}
            colorScheme="blue"
            px={2}
            py={1}
            borderRadius="full"
          >
            {chip.label}: {chip.value}
            <IconButton
              aria-label="Remove filter"
              icon={<CloseIcon />}
              size="xs"
              variant="ghost"
              ml={1}
              onClick={() => onRemoveFilter(chip.key)}
            />
          </Badge>
        ))}
      </HStack>
    </Box>
  );
}

export default FilterChips;

