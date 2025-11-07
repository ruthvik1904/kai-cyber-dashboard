import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  HStack,
  Radio,
  Select,
  CheckboxGroup,
  Checkbox,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { SortField } from '../../hooks/useSortedVulnerabilities';
import { useState } from 'react';
import { FilterState } from '../../hooks/useVulnerabilityFilters';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useColorMode } from '@chakra-ui/react';

const severityOptions = ['critical', 'high', 'medium', 'low'];

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
  const toast = useToast();
  const { preferences, updatePreferences } = useUserPreferences();
  const { setColorMode } = useColorMode();
  const [theme, setTheme] = useState(preferences.theme);
  const [sortField, setSortField] = useState<SortField>(preferences.defaultSortField);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(preferences.defaultSortOrder);
  const [severityFilter, setSeverityFilter] = useState<string[]>(preferences.defaultFilters.severity || []);

  const handleSave = () => {
    const newFilters: FilterState = {
      ...preferences.defaultFilters,
      severity: severityFilter.length ? severityFilter : undefined,
    };

    updatePreferences({
      theme,
      defaultSortField: sortField,
      defaultSortOrder: sortOrder,
      defaultFilters: newFilters,
    });

    if (theme === 'system') {
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setColorMode(prefersDark ? 'dark' : 'light');
      }
    } else {
      setColorMode(theme);
    }

    toast({ title: 'Preferences saved', status: 'success', duration: 3000, isClosable: true });
    onClose();
  };

  const handleReset = () => {
    setTheme('system');
    setSortField('cvss');
    setSortOrder('desc');
    setSeverityFilter([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>User Preferences</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={6}>
            <FormControl>
              <FormLabel>Theme</FormLabel>
              <RadioGroup value={theme} onChange={(value) => setTheme(value as typeof theme)}>
                <HStack spacing={6}>
                  <Radio value="light">Light</Radio>
                  <Radio value="dark">Dark</Radio>
                  <Radio value="system">System</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Default Sort</FormLabel>
              <HStack spacing={4}>
                <Select value={sortField} onChange={(e) => setSortField(e.target.value as SortField)}>
                  <option value="cvss">CVSS Score</option>
                  <option value="severity">Severity</option>
                  <option value="published">Published Date</option>
                  <option value="cve">CVE ID</option>
                </Select>
                <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}>
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </Select>
              </HStack>
            </FormControl>

            <FormControl>
              <FormLabel>Default Severity Filter</FormLabel>
              <CheckboxGroup value={severityFilter} onChange={(values) => setSeverityFilter(values as string[])}>
                <HStack spacing={4} wrap="wrap">
                  {severityOptions.map((option) => (
                    <Checkbox key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Checkbox>
                  ))}
                </HStack>
              </CheckboxGroup>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={handleReset}>
              Reset
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              Save Preferences
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
