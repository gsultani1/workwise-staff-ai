
import React from 'react';
import { SearchBar } from './SearchBar';
import { DashboardFilter } from './DashboardFilter';
import { UserProfileDropdown } from './UserProfileDropdown';
import { NotificationsDropdown } from './NotificationsDropdown';
import { useLocation } from 'react-router-dom';

interface TopBarProps {
  extraComponent?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({ extraComponent }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  // Add a dummy handler for onFilterChange
  const handleFilterChange = (filters: any) => {
    // This is a placeholder implementation to satisfy the prop requirement
    console.log('Filters changed in TopBar:', filters);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="flex flex-1 items-center gap-4">
        {isDashboard && <DashboardFilter onFilterChange={handleFilterChange} />}
        {!isDashboard && <SearchBar />}
      </div>
      <div className="flex items-center gap-4">
        {extraComponent}
        <NotificationsDropdown />
        <UserProfileDropdown />
      </div>
    </header>
  );
};
