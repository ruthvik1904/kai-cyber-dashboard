import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { SortField } from './useSortedVulnerabilities';
import { FilterState } from './useVulnerabilityFilters';
import { useColorMode } from '@chakra-ui/react';
import React from 'react';

const PREFERENCES_STORAGE_KEY = 'kai-cyber:user-preferences';

type ThemePreference = 'light' | 'dark' | 'system';

type UserPreferences = {
  theme: ThemePreference;
  defaultSortField: SortField;
  defaultSortOrder: 'asc' | 'desc';
  defaultFilters: FilterState;
};

type UserPreferencesContextValue = {
  preferences: UserPreferences;
  updatePreferences: (partial: Partial<UserPreferences>) => void;
};

const defaultPreferences: UserPreferences = {
  theme: 'system',
  defaultSortField: 'cvss',
  defaultSortOrder: 'desc',
  defaultFilters: {},
};

const UserPreferencesContext = createContext<UserPreferencesContextValue | undefined>(undefined);

function loadPreferences(): UserPreferences {
  if (typeof window === 'undefined') return defaultPreferences;
  const stored = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
  if (!stored) return defaultPreferences;
  try {
    const parsed = JSON.parse(stored) as UserPreferences;
    return { ...defaultPreferences, ...parsed };
  } catch {
    return defaultPreferences;
  }
}

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadPreferences());
  const { setColorMode } = useColorMode();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    if (preferences.theme === 'system') {
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setColorMode(prefersDark ? 'dark' : 'light');
      }
    } else {
      setColorMode(preferences.theme);
    }
  }, [preferences.theme, setColorMode]);

  const value = useMemo<UserPreferencesContextValue>(() => ({
    preferences,
    updatePreferences: (partial) => setPreferences((prev) => ({ ...prev, ...partial })),
  }), [preferences]);

  return React.createElement(UserPreferencesContext.Provider, { value }, children);
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}
