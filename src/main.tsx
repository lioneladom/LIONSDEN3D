import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { AppProvider } from './context/AppContext';
import { CLERK_PUBLISHABLE_KEY, clerkTheme } from './lib/clerk';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} appearance={clerkTheme}>
      <AppProvider>
        <App />
      </AppProvider>
    </ClerkProvider>
  </React.StrictMode>
);
