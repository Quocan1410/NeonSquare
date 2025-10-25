// frontend/components/ui/notification-dropdown.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Heart, MessageCircle, UserPlus, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

type IncomingDTO = {
  id: string;
  userId: string;
  content: string;
  type: 'friendRequest' | 'postUpdate' | 'groupCreation' | 'memberRequest';
  status: 'New' | 'Seen';
  createDate: string; // ISO
};

type UiType = 'like' | 'comment' | 'follow' | 'mention' | 'system';

interface Notification {
  id: string;
  type: UiType;
  user: { id: string; fullName: string; profilePic: string };
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

interface NotificationDropdownProps {
  className?: string;
}

const getIcon = (type: UiType) => {
  switch (type) {
    case 'like': return <Heart className="w-4 h-4 text-red-500" />;
    case 'comment': return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case 'follow': return <UserPlus className="w-4 h-4 text-green-500" />;
    default: return <Bell className="w-4 h-4 text-gray-500" />;
  }
};

const BASE = process.env.NEXT_PUBLIC_API_URL!; // e.g. http://localhost:8080/api

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const { user } = useAuth();
  const userId = user?.id;

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ---- helpers
  const mapDtoToUi = (dto: IncomingDTO): Notification => ({
    id: dto.id,
    type: 'system',
    user: { id: dto.userId, fullName: 'Someone', profilePic: '/avatars/01.png' },
    message: dto.content,
    timestamp: new Date(dto.createDate).toLocaleString(),
    read: dto.status === 'Seen',
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const badgeText = unreadCount > 99 ? '99+' : unreadCount.toString();

  // ---- initial fetch (persisted notifications)
  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE}/notifications/${userId}`);
        const list = (await res.json()) as IncomingDTO[];
        const mapped = list.map(mapDtoToUi);
        setNotifications(mapped);
      } catch (e) {
        console.error('Failed to fetch notifications', e);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [userId]);

  // ---- live events
  useEffect(() => {
    if (!userId) return;

    const handler = (e: Event) => {
      const dto = (e as CustomEvent).detail as IncomingDTO;
      // ignore if somehow another user's event arrives
      if (!dto || dto.userId !== userId) return;

      setNotifications(prev => [mapDtoToUi(dto), ...prev]);
    };

    window.addEventListener('notification:new', handler as EventListener);
    return () => window.removeEventListener('notification:new', handler as EventListener);
  }, [userId]);

  // ---- close on outside click
  useEffect(() => {
    const fn = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // ---- actions
  const markAsReadLocal = (id: string) =>
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));

  const markAsRead = async (id: string) => {
    if (!userId) return;
    markAsReadLocal(id);
    try {
      await fetch(`${BASE}/notifications/${userId}/${id}/read`, { method: 'POST' });
    } catch (e) {
      console.error('Failed to mark read', e);
    }
  };

  const markAllAsReadLocal = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const markAllAsRead = async () => {
    if (!userId) return;
    markAllAsReadLocal();
    try {
      // uses new backend endpoint; if not found, fall back to per-item
      const r = await fetch(`${BASE}/notifications/${userId}/read-all`, { method: 'POST' });
      if (!r.ok) {
        await Promise.all(
          notifications.filter(n => !n.read).map(n =>
            fetch(`${BASE}/notifications/${userId}/${n.id}/read`, { method: 'POST' })
          )
        );
      }
    } catch (e) {
      console.error('Failed to mark all read', e);
    }
  };

  const removeNotification = (id: string) =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  // ---- render
  const disabled = !userId;

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="relative btn-forum"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-label={`Notifications (${unreadCount} unread)`}
        disabled={disabled}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-destructive text-white text-[10px] leading-4 text-center"
          >
            {badgeText}
          </span>
        )}
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
                    className={cn(
                      'p-4 hover:bg-muted/50 transition-colors cursor-pointer',
                      !n.read ? 'bg-primary/5 border-l-2 border-l-primary' : 'opacity-80'
                    )}
                    onClick={() => { markAsRead(n.id); if (n.link) window.location.href = n.link; }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="shrink-0">{getIcon(n.type)}</div>
                      <Avatar className="avatar-forum w-8 h-8 shrink-0">
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
              <Button
                variant="ghost"
                size="sm"
                className="w-full btn-forum text-xs"
                onClick={() => { setIsOpen(false); window.location.href = '/notifications'; }}
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
