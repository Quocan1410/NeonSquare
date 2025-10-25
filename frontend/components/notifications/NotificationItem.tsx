// NeonSquare/frontend/components/notifications/NotificationItem.tsx
'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, UserPlus, MessageCircle, Users, Check } from 'lucide-react';
import { Notification } from '@/types';

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const [isRead, setIsRead] = useState(notification.status === 'seen');

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friendRequest':
        return <UserPlus className="w-4 h-4 text-primary" />;
      case 'postUpdate':
        return <MessageCircle className="w-4 h-4 text-success" />;
      case 'groupCreation':
        return <Users className="w-4 h-4 text-warning" />;
      case 'memberRequest':
        return <Users className="w-4 h-4 text-info" />;
      default:
        return <Bell className="w-4 h-4 text-forum-muted" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'friendRequest':
        return 'border-l-primary';
      case 'postUpdate':
        return 'border-l-success';
      case 'groupCreation':
        return 'border-l-warning';
      case 'memberRequest':
        return 'border-l-info';
      default:
        return 'border-l-forum-muted';
    }
  };

  const handleMarkAsRead = () => {
    setIsRead(true);
    // Here you would typically make an API call
    console.log('Marking notification as read:', notification.id);
  };

  return (
    <div className={`space-y-3 ${!isRead ? 'bg-primary/5' : ''}`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-full bg-secondary ${getNotificationColor(notification.type)}`}>
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-forum-primary text-sm leading-relaxed">
                {notification.content}
              </p>
              <p className="text-forum-muted text-xs mt-1">
                {formatTimeAgo(notification.createdAt)}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {!isRead && (
                <Badge className="badge-forum primary text-xs">New</Badge>
              )}
              {!isRead && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleMarkAsRead}
                  className="text-forum-muted hover:text-primary"
                >
                  <Check className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}