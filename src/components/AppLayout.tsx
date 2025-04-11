
import React from 'react';
import { SideNav } from './SideNav';
import { TopBar } from './TopBar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <SideNav />
      <div className="flex flex-col flex-1">
        <TopBar />
        <main className="flex-1 p-4 md:p-6 max-w-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
