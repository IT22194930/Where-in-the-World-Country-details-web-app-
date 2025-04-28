// src/App.jsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

const queryClient = new QueryClient();

// App wrapper with loading state
const AppContent = () => {
  const { loading } = React.useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
