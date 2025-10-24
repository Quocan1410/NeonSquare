'use client';

import { useOnlineStatusContext } from '@/contexts/OnlineStatusContext';
import { cn } from '@/lib/utils';

interface OnlineIndicatorProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4'
};

export function OnlineIndicator({ 
  className, 
  showText = false, 
  size = 'md' 
}: OnlineIndicatorProps) {
  const { isOnline, connectionStatus, lastSeen } = useOnlineStatusContext();

  const getStatusText = () => {
    if (!isOnline) {
      return 'Offline';
    }
    
    switch (connectionStatus) {
      case 'reconnecting':
        return 'Reconnecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'connected':
      default:
        return 'Online';
    }
  };

  const getStatusColor = () => {
    if (!isOnline) {
      return 'bg-gray-400';
    }
    
    switch (connectionStatus) {
      case 'reconnecting':
        return 'bg-yellow-400 animate-pulse';
      case 'disconnected':
        return 'bg-red-400';
      case 'connected':
      default:
        return 'bg-green-400';
    }
  };

  const formatLastSeen = () => {
    if (!lastSeen) return '';
    
    const now = new Date();
    const diff = now.getTime() - lastSeen.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <div
        className={cn(
          'rounded-full',
          sizeClasses[size],
          getStatusColor()
        )}
        title={isOnline ? `Last seen: ${formatLastSeen()}` : 'Offline'}
      />
      {showText && (
        <span className="text-xs text-forum-secondary">
          {getStatusText()}
        </span>
      )}
    </div>
  );
}
