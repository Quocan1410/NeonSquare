'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OnlineIndicator } from '@/components/ui/online-indicator';
import Link from 'next/link';
import { 
  Home, 
  Search, 
  Users, 
  Bell, 
  Settings, 
  Plus,
  MessageCircle,
  TrendingUp,
  BookOpen
} from 'lucide-react';

export function Sidebar() {
  const user = {
    fullName: 'John Doe',
    profilePic: '/avatar.jpg',
    isOnline: true
  };

  const navigationItems = [
    { icon: Home, label: 'Home', href: '/dashboard', active: true },
    { icon: Search, label: 'Explore', href: '/explore' },
    { icon: Users, label: 'Friends', href: '/friends' },
  ];

  const quickActions = [
    { icon: MessageCircle, label: 'Messages', href: '/messages' },
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
              <AvatarImage src={user.profilePic} alt={user.fullName} />
              <AvatarFallback className="gradient-primary text-primary-foreground">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-forum-primary">{user.fullName}</p>
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
                item.active ? 'active' : ''
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-forum-secondary px-3">Quick Actions</h3>
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="btn-forum w-full justify-start premium-hover block"
            >
              <action.icon className="w-4 h-4 mr-3" />
              {action.label}
            </Link>
          ))}
        </div>

        {/* Create Group */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-forum-secondary px-3">Groups</h3>
          <Button 
            className="btn-primary w-full justify-start hover-glow shadow-fresh animate-fresh-glow"
            onClick={() => {
              // TODO: Implement create group modal
              console.log('Create group clicked');
            }}
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
            className="sidebar-nav premium-hover"
          >
            <Settings className="w-5 h-5 mr-3" />
            <span>Settings</span>
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}