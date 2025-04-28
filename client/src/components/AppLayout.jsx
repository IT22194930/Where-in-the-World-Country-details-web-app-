import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
