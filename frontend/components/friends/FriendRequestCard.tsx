// NeonSquare/frontend/components/friends/FriendRequestCard.tsx
'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Users } from 'lucide-react';
import { Friendship } from '@/types';
import { apiService } from '@/lib/api';

interface FriendRequestCardProps {
  request: Friendship;
}

export function FriendRequestCard({ request }: FriendRequestCardProps) {
  const [status, setStatus] = useState(request.status as any);

  const formatTimeAgo = (d: Date | string) => {
    const date = d instanceof Date ? d : new Date(d);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const sender: any = request?.sender ?? {};
  const first = sender.firstName ?? '';
  const last = sender.lastName ?? '';
  const fullName: string = (sender.fullName ?? `${first} ${last}`.trim()) || 'Unknown User';

  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const rawPic = sender.profilePicUrl ?? sender.profilePic;
  const profilePicUrl: string | undefined = typeof rawPic === 'string' ? rawPic : undefined;

  const handleAccept = async () => {
    try {
      await apiService.acceptFriendRequest(String(request.id));
      setStatus('accepted');
    } catch (e: any) {
      console.error('Accept failed', e?.message || e);
      alert(e?.message || 'Failed to accept request');
    }
  };

  const handleDecline = async () => {
    try {
      await apiService.rejectFriendRequest(String(request.id));
      setStatus('declined');
    } catch (e: any) {
      console.error('Decline failed', e?.message || e);
      alert(e?.message || 'Failed to decline request');
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'accepted':
        return <Badge className="badge-forum success">Accepted</Badge>;
      case 'declined':
        return <Badge className="badge-forum error">Declined</Badge>;
      default:
        return <Badge className="badge-forum warning">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Avatar className="avatar-forum online w-12 h-12">
          <AvatarImage src={profilePicUrl} alt={fullName} />
          <AvatarFallback className="bg-primary text-white font-bold">
            {initials || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-forum-primary">{fullName}</h3>
              <p className="text-sm text-forum-muted">{sender.email ?? ''}</p>
              <p className="text-xs text-forum-muted">{formatTimeAgo(request.createdAt as any)}</p>
            </div>
            {getStatusBadge()}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-sm text-forum-muted">
        <Users className="w-4 h-4" />
        <span>3 mutual friends</span>
      </div>

      {status === 'pending' && (
        <div className="flex space-x-2">
          <Button size="sm" className="btn-success flex-1" onClick={handleAccept}>
            <Check className="w-4 h-4 mr-2" />
            Accept
          </Button>
          <Button size="sm" variant="outline" className="btn-secondary flex-1" onClick={handleDecline}>
            <X className="w-4 h-4 mr-2" />
            Decline
          </Button>
        </div>
      )}

      {status === 'accepted' && (
        <div className="flex items-center space-x-2 text-success">
          <Check className="w-4 h-4" />
          <span className="text-sm">Friend request accepted</span>
        </div>
      )}

      {status === 'declined' && (
        <div className="flex items-center space-x-2 text-error">
          <X className="w-4 h-4" />
          <span className="text-sm">Friend request declined</span>
        </div>
      )}
    </div>
  );
}
