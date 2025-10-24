'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    { icon: Bell, label: 'Notifications', href: '/notifications', badge: 3 },
  ];

  const quickActions = [
    { icon: Plus, label: 'Create Post', href: '/create' },
    { icon: MessageCircle, label: 'Messages', href: '/messages' },
  ];

  const trendingTopics = [
    { name: 'Mathematics', posts: 245 },
    { name: 'Physics', posts: 189 },
    { name: 'Programming', posts: 156 },
    { name: 'Science', posts: 134 },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-border h-screen overflow-y-auto">
      <div className="p-6 space-y-6">
        
        {/* User Profile */}
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-secondary">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.profilePic} alt={user.fullName} />
            <AvatarFallback className="bg-primary text-white">
              {user.fullName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{user.fullName}</p>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                item.active
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
              {item.badge && (
                <Badge className="ml-auto bg-red-500 text-white text-xs">
                  {item.badge}
                </Badge>
              )}
            </a>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground px-3">Quick Actions</h3>
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <action.icon className="w-4 h-4 mr-3" />
              {action.label}
            </Button>
          ))}
        </div>

        {/* Trending Topics */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground px-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending
          </h3>
          <div className="space-y-2">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">#{topic.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{topic.posts}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="pt-4 border-t border-border">
          <a
            href="/settings"
            className="flex items-center px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Settings className="w-5 h-5 mr-3" />
            <span>Settings</span>
          </a>
        </div>
      </div>
    </div>
  );
}