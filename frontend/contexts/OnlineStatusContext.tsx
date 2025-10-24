'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface OnlineStatusContextType {
  isOnline: boolean;
  lastSeen: Date | null;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  updateLastSeen: () => void;
  setOnline: (online: boolean) => void;
}

const OnlineStatusContext = createContext<OnlineStatusContextType | undefined>(undefined);

export function OnlineStatusProvider({ children }: { children: React.ReactNode }) {
  const { status, updateLastSeen, setOnline } = useOnlineStatus();

  return (
    <OnlineStatusContext.Provider
      value={{
        isOnline: status.isOnline,
        lastSeen: status.lastSeen,
        connectionStatus: status.connectionStatus,
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
