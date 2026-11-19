import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UgProvider, createDispatchApi, setDispatchApi } from '@the-universal-group/ui-react';
import App from './App';
import './index.css';

// Import ant.d styles
import 'antd/dist/reset.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Dev mode: point to localhost API
const isDev = import.meta.env.DEV;
const apiUrl = isDev ? 'http://localhost:3001' : 'https://api.theuniversalgroup.ca';

// Initialize dispatch API to use token from window.ugAuth (set up by UgProvider)
const dispatchApi = createDispatchApi({
  baseUrl: apiUrl,
  getToken: async () => {
    return (window as any).ugAuth?.getToken() || '';
  },
});

setDispatchApi(dispatchApi);

// Auth config for local development
// In production, this would be loaded from S3 components.json
const config = isDev ? {
  auth: {
    tokenEndpoint: 'http://localhost:3001/auth/token',
    groupsEndpoint: 'http://localhost:3001/auth/groups',
    // Google OAuth client ID - needs to be configured
    // For now, user must sign in via ug-ui-react first at localhost:3000
    clientId: '891628046187-1vgu88vlkqrrhkshd88r74kq1lnva4aq.apps.googleusercontent.com',
    hostedDomain: 'theuniversalgroup.ca',
  },
  'ug-ep-dispatch-atc': {
    components: ['auth'],
  },
} : {
  auth: {}, // Production config comes from S3
  'ug-ep-dispatch-atc': {
    components: ['auth'],
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UgProvider app="ug-ep-dispatch-atc" config={config}>
        <App />
      </UgProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
