/**
 * Main layout component with navigation
 */

import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Container, Flex, Heading, Spacer, Link as ChakraLink, Spinner, Text } from '@chakra-ui/react';
import { useVulnerabilityData } from '../../hooks/useVulnerabilityData';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { isLoading } = useVulnerabilityData();

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200" shadow="sm">
        <Container maxW="container.xl" py={4}>
          <Flex align="center">
            <Heading size="lg" color="blue.600">
              Kai Cyber Dashboard
            </Heading>
            <Spacer />
            <Flex gap={6} align="center">
              <ChakraLink
                as={Link}
                to="/"
                fontWeight={location.pathname === '/' ? 'bold' : 'normal'}
                color={location.pathname === '/' ? 'blue.600' : 'gray.600'}
                _hover={{ color: 'blue.600' }}
              >
                Dashboard
              </ChakraLink>
              <ChakraLink
                as={Link}
                to="/vulnerabilities"
                fontWeight={location.pathname === '/vulnerabilities' ? 'bold' : 'normal'}
                color={location.pathname === '/vulnerabilities' ? 'blue.600' : 'gray.600'}
                _hover={{ color: 'blue.600' }}
              >
                Vulnerabilities
              </ChakraLink>
              {isLoading && (
                <Flex align="center" gap={2}>
                  <Spinner size="sm" />
                  <Text fontSize="sm" color="gray.500">
                    Loading...
                  </Text>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>

      {/* Footer */}
      <Box as="footer" bg="white" borderTop="1px" borderColor="gray.200" mt={12}>
        <Container maxW="container.xl" py={4}>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Security Vulnerability Dashboard
          </Text>
        </Container>
      </Box>
    </Box>
  );
}

export default Layout;

