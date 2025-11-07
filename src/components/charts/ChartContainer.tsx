/**
 * Reusable container component for charts
 * Provides consistent styling and error/loading states
 */

import { ReactNode } from 'react';
import { Box, Heading, Text, Spinner, Center, useColorModeValue } from '@chakra-ui/react';

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  isLoading?: boolean;
  error?: string | null;
  height?: string | number;
}

export default function ChartContainer({
  title,
  children,
  isLoading = false,
  error = null,
  height = 400,
}: ChartContainerProps) {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      p={6}
      borderRadius="lg"
      shadow="md"
      h={height}
    >
      <Heading size="md" mb={4}>
        {title}
      </Heading>
      {isLoading ? (
        <Center h="calc(100% - 60px)">
          <Spinner size="lg" />
        </Center>
      ) : error ? (
        <Center h="calc(100% - 60px)">
          <Text color="red.500">{error}</Text>
        </Center>
      ) : (
        <Box h="calc(100% - 60px)">{children}</Box>
      )}
    </Box>
  );
}

