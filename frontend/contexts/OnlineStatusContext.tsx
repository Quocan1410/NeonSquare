'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface OnlineStatusContextType {
  isOnline: boolean;
  lastSeen: Date | null;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  updateLastSeen: () => void;
  setOnline: (online: boolean) => void;
}

const OnlineStatusContext = createContext<OnlineStatusContextType | undefined>(undefined);

export function OnlineStatusProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true); // Default to online
  const [lastSeen, setLastSeen] = useState<Date | null>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');

  useEffect(() => {
    // Simple online status without WebSocket
    setIsOnline(true);
    setConnectionStatus('connected');
    setLastSeen(new Date());
  }, []);

  const updateLastSeen = () => {
    setLastSeen(new Date());
  };

  const setOnline = (online: boolean) => {
    setIsOnline(online);
    setConnectionStatus(online ? 'connected' : 'disconnected');
  };

  return (
    <OnlineStatusContext.Provider
      value={{
        isOnline,
        lastSeen,
        connectionStatus,
        updateLastSeen,
        setOnline
      }}
    >
      {children}
    </OnlineStatusContext.Provider>
  );
}

export function useOnlineStatusContext() {
  const context = useContext(OnlineStatusContext);
  if (context === undefined) {
    throw new Error('useOnlineStatusContext must be used within an OnlineStatusProvider');
  }
  return context;
}
