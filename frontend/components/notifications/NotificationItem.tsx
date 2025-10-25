// NeonSquare/frontend/components/notifications/NotificationItem.tsx
'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, UserPlus, MessageCircle, Users, Check, ThumbsUp } from 'lucide-react';
import { Notification } from '@/types';

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter();
  const [isRead, setIsRead] = useState(notification.status === 'seen');

  const created = useMemo(() => {
    const raw = (notification as any).createdAt ?? (notification as any).createDate ?? new Date().toISOString();
    return typeof raw === 'string' ? new Date(raw) : (raw as Date);
  }, [notification]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Normalize type to uppercase variants used by backend
  const type = String(notification.type || '').toUpperCase();

  const getNotificationIcon = () => {
    switch (type) {
      case 'FRIEND_REQUEST':
        return <UserPlus className="w-4 h-4 text-primary" />;
      case 'FRIEND_ACCEPTED':
        return <Users className="w-4 h-4 text-success" />;
      case 'COMMENT':
        return <MessageCircle className="w-4 h-4 text-info" />;
      case 'LIKE':
        return <ThumbsUp className="w-4 h-4 text-primary" />;
      default:
        return <Bell className="w-4 h-4 text-forum-muted" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'FRIEND_REQUEST':
        return 'border-l-primary';
      case 'FRIEND_ACCEPTED':
        return 'border-l-success';
      case 'COMMENT':
        return 'border-l-info';
      case 'LIKE':
        return 'border-l-primary';
      default:
        return 'border-l-forum-muted';
    }
  };

  // Deep-link behavior
  const href = useMemo(() => {
    const target = (notification.target ?? '') as string;
    switch (type) {
      case 'FRIEND_REQUEST':
      case 'FRIEND_ACCEPTED':
        return target ? `/profile?userId=${encodeURIComponent(target)}` : null;
      case 'COMMENT':
      case 'LIKE':
        return target ? `/post/${encodeURIComponent(target)}` : null;
      default:
        return null;
    }
  }, [type, notification.target]);

  const onOpen = () => {
    if (href) router.push(href);
  };

  // Frontend normalization for bad backend prefix like "Someone Duy Nguyen ..."
  const normalizedText = useMemo(() => {
    const text = notification.content || '';
    const m = text.match(/^Someone\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)+)\s+(.*)$/);
    if (m) {
      // If a likely full name follows "Someone", drop the redundant prefix.
      return `${m[1]} ${m[2]}`.trim();
    }
    return text;
  }, [notification.content]);

  const initials =
    (normalizedText?.split(' ')?.[0]?.charAt(0) ?? 'N') + (normalizedText?.split(' ')?.[1]?.charAt(0) ?? '');

  const markRead = () => {
    setIsRead(true);
    // TODO: call backend "mark as read" when wiring NotificationController here
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`w-full text-left space-y-3 p-3 rounded-lg border-l-4 ${getBorderColor()} hover:bg-muted/60 transition-colors`}
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-full bg-secondary">
          {getNotificationIcon()}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-forum-primary text-sm leading-relaxed">
                {normalizedText}
              </p>
              <p className="text-forum-muted text-xs mt-1">
                {formatTimeAgo(created)}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {!isRead && <Badge className="badge-forum primary text-xs">New</Badge>}
              {!isRead && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => { e.stopPropagation(); markRead(); }}
                  className="text-forum-muted hover:text-primary"
                >
                  <Check className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
