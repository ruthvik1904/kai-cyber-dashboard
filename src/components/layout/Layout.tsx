/**
 * Main layout component with navigation
 */

import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Container, Flex, Heading, Spacer, Link as ChakraLink, Spinner, Text, IconButton, useDisclosure, useColorModeValue } from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import { useVulnerabilityData } from '../../hooks/useVulnerabilityData';
import PreferencesModal from '../settings/PreferencesModal';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { isLoading } = useVulnerabilityData();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pageBg = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('white', 'gray.800');
  const headerBorder = useColorModeValue('gray.200', 'gray.700');
  const mutedText = useColorModeValue('gray.600', 'gray.300');
  const footerBg = headerBg;
  const footerBorder = headerBorder;

  return (
    <Box minH="100vh" bg={pageBg}>
      {/* Header */}
      <Box bg={headerBg} borderBottom="1px" borderColor={headerBorder} shadow="sm">
        <Container maxW="container.xl" py={4}>
          <Flex align="center">
            <Heading size="lg" color="blue.500">
              Kai Cyber Dashboard
            </Heading>
            <Spacer />
            <Flex gap={6} align="center">
              <ChakraLink
                as={Link}
                to="/"
                fontWeight={location.pathname === '/' ? 'bold' : 'normal'}
                color={location.pathname === '/' ? 'blue.600' : mutedText}
                _hover={{ color: 'blue.600' }}
              >
                Dashboard
              </ChakraLink>
              <ChakraLink
                as={Link}
                to="/vulnerabilities"
                fontWeight={location.pathname === '/vulnerabilities' ? 'bold' : 'normal'}
                color={location.pathname === '/vulnerabilities' ? 'blue.600' : mutedText}
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
              <IconButton
                aria-label="Open preferences"
                icon={<SettingsIcon />}
                variant="ghost"
                onClick={onOpen}
              />
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>

      {/* Footer */}
      <Box as="footer" bg={footerBg} borderTop="1px" borderColor={footerBorder} mt={12}>
        <Container maxW="container.xl" py={4}>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Security Vulnerability Dashboard
          </Text>
        </Container>
      </Box>

      <PreferencesModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}

export default Layout;

