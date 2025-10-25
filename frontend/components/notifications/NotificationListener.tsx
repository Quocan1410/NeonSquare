// frontend/components/notifications/NotificationListener.tsx
'use client';

import { useEffect } from 'react';
import { connectNotifications } from '@/lib/notifications';
import { useAuth } from '@/contexts/AuthContext';

export default function NotificationListener() {
  const { user } = useAuth();
  const uid = user?.id; // UUID string from your AuthContext

  useEffect(() => {
    if (!uid) return;

    const disconnect = connectNotifications(uid, (msg) => {
      // Broadcast a window event usable by any UI
      window.dispatchEvent(new CustomEvent('notification:new', { detail: msg }));
    });

    return () => {
      disconnect(); // returns void (no TS error)
    };
  }, [uid]);

  return null;
}
