import React, { useState } from 'react';
import { Bell, Check, Search, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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

export const TopBar = () => {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const { profile, signOut, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();
  
  const unreadCount = notifications.filter(notif => !notif.read).length;
  
  const markAsRead = (id: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const dismissNotification = (id: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notif => notif.id !== id)
    );
    toast({
      title: "Notification dismissed",
      description: "The notification has been removed.",
    });
  };
  
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
    toast({
      title: "All notifications marked as read",
    });
  };

  const getInitials = () => {
    if (!profile?.first_name && !profile?.last_name) return 'U';
    return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`;
  };

  return (
    <header className="border-b border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md mr-4 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-md border border-input bg-background pl-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        
        <div className="flex items-center ml-auto gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-workwise-green text-[10px] font-medium text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="p-0 focus:bg-transparent">
                      <div 
                        className={`w-full px-2 py-2 flex flex-col text-sm ${notification.read ? '' : 'bg-muted/40'}`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <span className="font-medium">{notification.title}</span>
                          <div className="flex items-center space-x-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => dismissNotification(notification.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-xs">{notification.message}</p>
                        <span className="text-xs text-muted-foreground mt-1">{notification.time}</span>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="justify-center text-center text-sm text-workwise-blue cursor-pointer"
                onClick={() => {
                  toast({
                    title: "View all notifications",
                    description: "Redirecting to notifications center...",
                  });
                }}
              >
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <div className="w-6 h-6 rounded-full bg-workwise-blue flex items-center justify-center text-white text-xs font-medium">
                  {getInitials()}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
