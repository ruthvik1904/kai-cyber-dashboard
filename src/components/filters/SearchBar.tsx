/**
 * Real-time search input component with debouncing
 */

import { Input, InputGroup, InputLeftElement, InputRightElement, IconButton } from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash-es';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

function SearchBar({
  onSearch,
  placeholder = 'Search by CVE, description, or package name...',
  debounceMs = 300,
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState('');

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, debounceMs),
    [onSearch, debounceMs]
  );

  useEffect(() => {
    debouncedSearch(searchValue);
  }, [searchValue, debouncedSearch]);

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
  };

  return (
    <InputGroup size="lg">
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.400" />
      </InputLeftElement>
      <Input
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {searchValue && (
        <InputRightElement>
          <IconButton
            aria-label="Clear search"
            icon={<CloseIcon />}
            size="sm"
            variant="ghost"
            onClick={handleClear}
          />
        </InputRightElement>
      )}
    </InputGroup>
  );
}

export default SearchBar;

