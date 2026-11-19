/// <reference types="vite/client" />

interface Window {
  ugConfig?: {
    apiUrl: string;
  };
  ugAuth?: {
    getToken: () => Promise<string>;
  };
}
