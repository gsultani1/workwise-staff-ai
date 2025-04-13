
import React from 'react';
import { SearchBar } from './SearchBar';
import { NotificationsDropdown } from './NotificationsDropdown';
import { UserProfileDropdown } from './UserProfileDropdown';

// Sample notifications data
const sampleNotifications = [
  {
    id: 1,
    title: 'New Time Off Request',
    message: 'Lisa Kim has requested time off on April 12th',
    time: '10 minutes ago',
    read: false
  },
  {
    id: 2,
    title: 'Schedule Updated',
    message: 'Your shift on Wednesday has been modified',
    time: '2 hours ago',
    read: false
  },
  {
    id: 3,
    title: 'Staff Meeting',
    message: 'Don\'t forget about the team meeting tomorrow at 9 AM',
    time: '1 day ago',
    read: false
  }
];

export const TopBar: React.FC = () => {
  return (
    <header className="border-b border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between">
        <SearchBar />
        
        <div className="flex items-center ml-auto gap-2">
          <NotificationsDropdown initialNotifications={sampleNotifications} />
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};
