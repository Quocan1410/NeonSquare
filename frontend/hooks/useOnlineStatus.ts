'use client';

import { useState, useEffect, useCallback } from 'react';

interface OnlineStatus {
    isOnline: boolean;
    lastSeen: Date | null;
    connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
}

interface UseOnlineStatusReturn {
    status: OnlineStatus;
    updateLastSeen: () => void;
    setOnline: (online: boolean) => void;
}

export function useOnlineStatus(): UseOnlineStatusReturn {
    const [status, setStatus] = useState<OnlineStatus>({
        isOnline: navigator.onLine,
        lastSeen: new Date(),
        connectionStatus: 'connected'
    });

    // Update last seen timestamp
    const updateLastSeen = useCallback(() => {
        setStatus(prev => ({
            ...prev,
            lastSeen: new Date()
        }));
    }, []);

    // Set online status manually
    const setOnline = useCallback((online: boolean) => {
        setStatus(prev => ({
            ...prev,
            isOnline: online,
            lastSeen: online ? new Date() : prev.lastSeen,
            connectionStatus: online ? 'connected' : 'disconnected'
        }));
    }, []);

    // Listen to browser online/offline events
    useEffect(() => {
        const handleOnline = () => {
            setStatus(prev => ({
                ...prev,
                isOnline: true,
                lastSeen: new Date(),
                connectionStatus: 'connected'
            }));
        };

        const handleOffline = () => {
            setStatus(prev => ({
                ...prev,
                isOnline: false,
                connectionStatus: 'disconnected'
            }));
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Simulate periodic last seen updates when online
    useEffect(() => {
        if (!status.isOnline) return;

        const interval = setInterval(() => {
            updateLastSeen();
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, [status.isOnline, updateLastSeen]);

    // Simulate connection status changes
    useEffect(() => {
        if (!status.isOnline) return;

        const simulateReconnection = () => {
            setStatus(prev => ({
                ...prev,
                connectionStatus: 'reconnecting'
            }));

            setTimeout(() => {
                setStatus(prev => ({
                    ...prev,
                    connectionStatus: 'connected'
                }));
            }, 2000);
        };

        // Simulate occasional reconnection (for demo purposes)
        const interval = setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every 5 minutes
                simulateReconnection();
            }
        }, 300000);

        return () => clearInterval(interval);
    }, [status.isOnline]);

    return {
        status,
        updateLastSeen,
        setOnline
    };
}
