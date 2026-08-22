'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Navbar } from './Navbar';

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const { currentUser, logout } = useApp();
  const pathname = usePathname();

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/signup';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-lavender flex flex-col items-center justify-center p-4">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender flex flex-col">
      <Navbar currentUser={currentUser} onLogout={logout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 transition-all duration-200">
        {children}
      </main>
    </div>
  );
};