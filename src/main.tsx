import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UgProvider, createDispatchApi, setDispatchApi } from '@the-universal-group/ui-react';
import App from './App';
import './index.css';

// Import ug-ui styles (includes ant.d theming)
import '@the-universal-group/ui/dist/index.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Initialize dispatch API
// TODO: Wire this up properly through UgProvider context
// For now, using a placeholder token getter
const dispatchApi = createDispatchApi({
  baseUrl: window.ugConfig?.apiUrl || 'https://api.theuniversalgroup.ca',
  getToken: async () => {
    // TODO: Get token from window.ugAuth or UgProvider
    return window.ugAuth?.getToken() || '';
  },
});

setDispatchApi(dispatchApi);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UgProvider
        config={{
          apiUrl: 'https://api.theuniversalgroup.ca',
          authUrl: 'https://api.theuniversalgroup.ca/auth',
        }}
      >
        <App />
      </UgProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
