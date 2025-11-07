import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './config/queryClient';
import App from './App';
import theme from './theme';
import { UserPreferencesProvider } from './hooks/useUserPreferences';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <UserPreferencesProvider>
          <App />
        </UserPreferencesProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

