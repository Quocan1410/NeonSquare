'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OnlineIndicator } from '@/components/ui/online-indicator';
import { CreateGroupModal } from '@/components/ui/create-group-modal';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { addToast, ToastContainer } from '@/components/ui/toast';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Search, 
  Users, 
  Bell, 
  Settings, 
  Plus,
  TrendingUp,
  BookOpen,
  LogOut
} from 'lucide-react';

export function Sidebar() {
  const { user, logout } = useAuth();
  const { themeColors } = useTheme();
  const pathname = usePathname();
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  const handleLogout = () => {
    addToast({
      type: 'success',
      title: 'Logged out successfully',
      description: 'See you next time!',
    });
    logout();
  };

  const navigationItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: Search, label: 'Explore', href: '/explore' },
    { icon: Users, label: 'Friends', href: '/friends' },
  ];


  const trendingTopics = [
    { name: 'Mathematics', posts: 245 },
    { name: 'Physics', posts: 189 },
    { name: 'Programming', posts: 156 },
    { name: 'Science', posts: 134 },
  ];

  return (
    <div className="forum-sidebar scrollbar-forum">
      <div className="flex flex-col h-full">
        <div className="p-6 space-y-6 flex-1">
        
        {/* User Profile */}
        <Link href="/profile" className="block">
          <div className="forum-card flex items-center space-x-3 p-3 premium-hover">
            <Avatar className="avatar-forum w-10 h-10">
              <AvatarImage src={user?.profilePicUrl} alt={`${user?.firstName} ${user?.lastName}`} />
              <AvatarFallback className="gradient-primary text-primary-foreground">
                {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-forum-primary">
                {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </p>
              <OnlineIndicator showText={true} size="sm" />
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`sidebar-nav ${
                pathname === item.href ? 'active' : ''
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>


        {/* Create Group */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-forum-secondary px-3">Groups</h3>
          <Button 
            className="btn-primary w-full justify-start hover-glow shadow-fresh animate-fresh-glow"
            onClick={() => setIsCreateGroupOpen(true)}
          >
            <Plus className="w-4 h-4 mr-3" />
            Create Group
          </Button>
        </div>

        {/* Trending Topics */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-forum-secondary px-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending
          </h3>
          <div className="space-y-2">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="thread-card flex items-center justify-between p-3 premium-hover">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm text-forum-primary">#{topic.name}</span>
                </div>
                <span className="text-xs text-forum-secondary">{topic.posts}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="pt-4 divider-forum">
          <Link
            href="/settings"
            className={`sidebar-nav premium-hover ${
              pathname === '/settings' ? 'active' : ''
            }`}
          >
            <Settings className="w-5 h-5 mr-3" />
            <span>Settings</span>
          </Link>
        </div>

        {/* Logout */}
        <div className="pt-4 border-t border-border">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-forum-secondary hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
        </div>
      </div>
      <ToastContainer />
      <CreateGroupModal 
        isOpen={isCreateGroupOpen} 
        onClose={() => setIsCreateGroupOpen(false)} 
      />
    </div>
  );
}