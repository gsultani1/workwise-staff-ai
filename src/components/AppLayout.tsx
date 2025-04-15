
import React from 'react';
import { SideNav } from './SideNav';
import { TopBar } from './TopBar';
import { ErrorBoundary } from './ErrorBoundary';

interface AppLayoutProps {
  children: React.ReactNode;
  extraHeaderComponent?: React.ReactNode;
}

export const AppLayout = ({ children, extraHeaderComponent }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <SideNav />
      <div className="flex flex-col flex-1">
        <TopBar extraComponent={extraHeaderComponent} />
        <ErrorBoundary>
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
        </ErrorBoundary>
      </div>
    </div>
  );
};
