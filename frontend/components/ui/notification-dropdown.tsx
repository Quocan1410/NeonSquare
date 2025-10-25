// frontend/components/ui/notification-dropdown.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Heart, MessageCircle, UserPlus, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type IncomingDTO = {
  id: string;
  userId: string;
  content: string;
  type: 'friendRequest' | 'postUpdate' | 'groupCreation' | 'memberRequest';
  status: 'New' | 'Seen';
  createDate: string; // ISO
};

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  user: {
    id: string;
    fullName: string;
    profilePic: string;
  };
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

interface NotificationDropdownProps {
  className?: string;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'like': return <Heart className="w-4 h-4 text-red-500" />;
    case 'comment': return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case 'follow': return <UserPlus className="w-4 h-4 text-green-500" />;
    default: return <Bell className="w-4 h-4 text-gray-500" />;
  }
};

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Initial fetch (optional – still empty until you add REST)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        // TODO: replace with apiService.getNotifications()
        setNotifications([]);
      } catch (e) {
        console.error('Failed to fetch notifications', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Listen to real-time push from NotificationListener
  useEffect(() => {
    const handler = (e: Event) => {
      const dto = (e as CustomEvent).detail as IncomingDTO;

      // Map DTO to UI shape. You can enrich with user’s name/avatar via another call if you want.
      const mapped: Notification = {
        id: dto.id,
        type: 'system',
        user: {
          id: dto.userId,
          fullName: 'Someone',
          profilePic: '/avatars/01.png',
        },
        message: dto.content,
        timestamp: new Date(dto.createDate).toLocaleString(),
        read: dto.status === 'Seen',
      };

      setNotifications(prev => [mapped, ...prev]);
    };

    window.addEventListener('notification:new', handler as EventListener);
    return () => window.removeEventListener('notification:new', handler as EventListener);
  }, []);

  // Close on outside click
  useEffect(() => {
    const fn = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const markAsRead = (id: string) =>
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  const markAllAsRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const removeNotification = (id: string) =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <Button variant="ghost" size="sm" className="relative btn-forum" onClick={() => setIsOpen(!isOpen)} aria-label={`Notifications (${unreadCount} unread)`}>
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full" />}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-forum-primary">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs btn-forum">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-xs btn-forum">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                <p className="text-forum-secondary">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-forum-secondary mx-auto mb-3" />
                <p className="text-forum-secondary">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn('p-4 hover:bg-muted/50 transition-colors cursor-pointer', !n.read && 'bg-primary/5 border-l-2 border-l-primary')}
                    onClick={() => { markAsRead(n.id); if (n.link) window.location.href = n.link; }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">{getIcon(n.type)}</div>
                      <Avatar className="avatar-forum w-8 h-8 flex-shrink-0">
                        <AvatarImage src={n.user.profilePic} alt={n.user.fullName} />
                        <AvatarFallback className="gradient-primary text-primary-foreground text-xs">
                          {n.user.fullName.split(' ').map(x => x[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-forum-primary">
                              <span className="font-medium">{n.user.fullName}</span>{' '}
                              {n.message}
                            </p>
                            <p className="text-xs text-forum-secondary mt-1">{n.timestamp}</p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            {!n.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                            <Button
                              variant="ghost" size="sm"
                              onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                              className="text-xs btn-forum p-1 h-6 w-6"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-border bg-muted/20">
              <Button variant="ghost" size="sm" className="w-full btn-forum text-xs" onClick={() => { setIsOpen(false); window.location.href = '/notifications'; }}>
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
