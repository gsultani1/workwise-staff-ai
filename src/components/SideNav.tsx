
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Clock, BarChart3, Users, Settings, Briefcase, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export const SideNav = () => {
  const { profile, signOut, isAdmin, isManager } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', href: '/', icon: Briefcase },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Time Off', href: '/time-off', icon: Clock },
    // Only show Staff page to managers and admins
    ...(isAdmin || isManager ? [{ name: 'Staff', href: '/staff', icon: Users }] : []),
    // Only show Analytics page to managers and admins
    ...(isAdmin || isManager ? [{ name: 'Analytics', href: '/analytics', icon: BarChart3 }] : []),
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const getInitials = () => {
    if (!profile?.first_name && !profile?.last_name) return 'U';
    return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`;
  };

  const getFullName = () => {
    if (!profile?.first_name && !profile?.last_name) return 'User';
    return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  };

  const getRoleDisplay = () => {
    if (isAdmin) return 'Admin';
    if (isManager) return 'Manager';
    return 'Employee';
  };

  return (
    <aside className="w-full md:w-64 md:flex-shrink-0 border-r border-border bg-card">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-workwise-blue" />
            <h1 className="font-semibold text-xl">WorkWise</h1>
          </div>
        </div>
        <nav className="flex-1 overflow-auto p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-workwise-blue text-white"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-workwise-blue flex items-center justify-center text-white text-sm font-medium">
                {getInitials()}
              </div>
              <div>
                <p className="text-sm font-medium">{getFullName()}</p>
                <p className="text-xs text-muted-foreground">{getRoleDisplay()}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center gap-2"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};
