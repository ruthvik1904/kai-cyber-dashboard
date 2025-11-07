import { Box, Text, Wrap, WrapItem, Badge } from '@chakra-ui/react';
import { FlattenedVulnerability } from '../../types/vulnerability';

interface RiskFactorsListProps {
  vulnerability: FlattenedVulnerability;
}

export default function RiskFactorsList({ vulnerability }: RiskFactorsListProps) {
  const riskFactorEntries = Object.keys(vulnerability.riskFactors || {});

  if (riskFactorEntries.length === 0) {
    return (
      <Box>
        <Text fontSize="sm" color="gray.500">
          No risk factors reported for this vulnerability.
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text fontWeight="bold" mb={2}>
        Risk Factors
      </Text>
      <Wrap spacing={2}>
        {riskFactorEntries.map((factor) => (
          <WrapItem key={factor}>
            <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
              {factor}
            </Badge>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
}
