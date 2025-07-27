
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  Calendar, 
  ChevronDown, 
  ClipboardList, 
  FileText,
  Home, 
  Menu, 
  LogOut, 
  Settings, 
  Users, 
  CheckCircle2,
  X,
  School,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const adminMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Manage Users', path: '/users' },
    { icon: CheckCircle2, label: 'Attendance Records', path: '/attendance' },
    { icon: Calendar, label: 'Academic Calendar', path: '/calendar' },
    { icon: ClipboardList, label: 'Timetables', path: '/timetables' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const studentMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: CheckCircle2, label: 'My Attendance', path: '/my-attendance' },
    { icon: ClipboardList, label: 'My Timetable', path: '/my-timetable' },
    { icon: Calendar, label: 'College Calendar', path: '/calendar' },
  ];

  const staffMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: CheckCircle2, label: 'My Attendance', path: '/my-attendance' },
    { icon: FileText, label: 'My Schedule', path: '/my-schedule' },
    { icon: Calendar, label: 'College Calendar', path: '/calendar' },
  ];

  const getMenuItems = () => {
    switch (user?.role?.replace('ROLE_', '').toLowerCase()) {
      case 'admin':
        return adminMenuItems;
      case 'student':
        return studentMenuItems;
      case 'staff':
        return staffMenuItems;
      default:
        return [];
    }
  };

  const getRoleIcon = () => {
    switch (user?.role?.replace('ROLE_', '').toLowerCase()) {
      case 'admin':
        return { icon: <UserIcon className="h-4 w-4" />, color: 'bg-blue-500' };
      case 'student':
        return { icon: <School className="h-4 w-4" />, color: 'bg-green-500' };
      case 'staff':
        return { icon: <UserIcon className="h-4 w-4" />, color: 'bg-amber-500' };
      default:
        return { icon: <UserIcon className="h-4 w-4" />, color: 'bg-gray-500' };
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-sidebar transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            {sidebarOpen ? (
              <>
                <School className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg">SmartAttend</span>
              </>
            ) : (
              <School className="h-8 w-8 text-primary mx-auto" />
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        <Separator />
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {getMenuItems().map((item, index) => (
              <li key={index}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start font-normal hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    window.location.pathname === item.path && "bg-sidebar-accent text-primary font-medium"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", sidebarOpen ? "mr-3" : "mx-auto")} />
                  {sidebarOpen && <span>{item.label}</span>}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 mt-auto">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={logout}
          >
            <LogOut className={cn("h-5 w-5 shrink-0", sidebarOpen ? "mr-3" : "mx-auto")} />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          sidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background/95 backdrop-blur">
          <div className="flex flex-1 items-center justify-between px-4">
            <h1 className="text-xl font-semibold hidden sm:block">
              {window.location.pathname === '/dashboard' ? 'Dashboard' : 
               window.location.pathname === '/users' ? 'Manage Users' : 
               window.location.pathname === '/attendance' ? 'Attendance Records' : 
               window.location.pathname === '/my-attendance' ? 'My Attendance' : 
               window.location.pathname === '/my-timetable' ? 'My Timetable' : 
               window.location.pathname === '/my-schedule' ? 'My Schedule' : 
               window.location.pathname === '/calendar' ? 'Academic Calendar' : 
               window.location.pathname === '/timetables' ? 'Timetables' : 
               window.location.pathname === '/settings' ? 'Settings' : 
               'Dashboard'}
            </h1>
            <div className="flex items-center gap-4">
              <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Button variant="ghost" size="sm" className="h-auto px-2 text-xs">Mark all as read</Button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto">
                    {[1, 2, 3].map((i) => (
                      <DropdownMenuItem key={i} className="flex flex-col items-start p-3 cursor-pointer">
                        <div className="flex items-start gap-2 w-full">
                          <div className="bg-blue-100 rounded-full p-2 shrink-0">
                            <Bell className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">Attendance Reminder</p>
                            <p className="text-xs text-muted-foreground">Don't forget to mark your attendance today!</p>
                          </div>
                          <X className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </div>
                        <span className="text-xs text-muted-foreground mt-2">2 minutes ago</span>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center">
                    <Button variant="ghost" size="sm" className="w-full text-primary">View all notifications</Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className={getRoleIcon().color}>
                        {user?.name ? getInitials(user.name) : '?'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="flex flex-col gap-1">
                    <span>{user?.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
                    <div className="flex items-center mt-1">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs font-normal",
                          user?.role?.replace('ROLE_', '').toLowerCase() === 'admin' ? "border-blue-300 bg-blue-50 text-blue-600" :
                          user?.role?.replace('ROLE_', '').toLowerCase() === 'student' ? "border-green-300 bg-green-50 text-green-600" :
                          "border-amber-300 bg-amber-50 text-amber-600"
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          {getRoleIcon().icon}
                          <span>
                            {user?.role?.replace('ROLE_', '').toLowerCase() === 'admin' ? 'Administrator' : 
                             user?.role?.replace('ROLE_', '').toLowerCase() === 'student' ? 'Student' : 
                             user?.role?.replace('ROLE_', '').toLowerCase() === 'staff' ? 'Staff' : 'User'}
                          </span>
                        </span>
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t p-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Smart Attendance System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;
