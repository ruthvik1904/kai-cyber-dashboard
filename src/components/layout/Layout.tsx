/**
 * Main layout component with navigation
 */

import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Flex,
  Heading,
  Spacer,
  Link as ChakraLink,
  Spinner,
  Text,
  IconButton,
  useDisclosure,
  useColorModeValue,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useBreakpointValue,
} from '@chakra-ui/react';
import { SettingsIcon, HamburgerIcon } from '@chakra-ui/icons';
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
  const footerBg = headerBg;
  const footerBorder = headerBorder;
  const mutedText = useColorModeValue('gray.600', 'gray.300');
  const isDesktop = useBreakpointValue({ base: false, md: true });

  const navLinks = [
    { label: 'Dashboard', href: '/' },
    { label: 'Vulnerabilities', href: '/vulnerabilities' },
  ];

  return (
    <Box minH="100vh" bg={pageBg} display="flex" flexDirection="column">
      {/* Header */}
      <Box bg={headerBg} borderBottom="1px" borderColor={headerBorder} shadow="sm">
        <Container maxW="container.xl" py={{ base: 3, md: 4 }}>
          <Flex align="center" gap={3}>
            <Heading size={{ base: 'md', md: 'lg' }} color={useColorModeValue('blue.500', 'blue.300')}>
              Kai Cyber Dashboard
            </Heading>
            <Spacer />
            <HStack spacing={3} align="center">
              {isLoading && (
                <HStack align="center" spacing={2} color={mutedText}>
                  <Spinner size="sm" />
                  <Text fontSize="sm">Loading...</Text>
                </HStack>
              )}
              {isDesktop ? (
                <HStack spacing={4} align="center">
                  {navLinks.map((link) => (
                    <ChakraLink
                      key={link.href}
                      as={Link}
                      to={link.href}
                      fontWeight={location.pathname === link.href ? 'bold' : 'medium'}
                      color={location.pathname === link.href ? useColorModeValue('blue.600', 'blue.200') : mutedText}
                      _hover={{ color: useColorModeValue('blue.600', 'blue.200') }}
                    >
                      {link.label}
                    </ChakraLink>
                  ))}
                </HStack>
              ) : (
                <Menu>
                  <MenuButton as={IconButton} icon={<HamburgerIcon />} variant="ghost" />
                  <MenuList>
                    {navLinks.map((link) => (
                      <MenuItem as={Link} to={link.href} key={link.href} fontWeight={location.pathname === link.href ? 'bold' : 'normal'}>
                        {link.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              )}
              <IconButton
                aria-label="Open preferences"
                icon={<SettingsIcon />}
                variant="ghost"
                onClick={onOpen}
              />
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={{ base: 6, md: 8 }} px={{ base: 4, md: 6 }} flex="1">
        {children}
      </Container>

      {/* Footer */}
      <Box as="footer" bg={footerBg} borderTop="1px" borderColor={footerBorder} mt="auto">
        <Container maxW="container.xl" py={{ base: 4, md: 6 }}>
          <Text fontSize="sm" color={mutedText} textAlign="center">
            Security Vulnerability Dashboard
          </Text>
        </Container>
      </Box>

      <PreferencesModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}

export default Layout;

