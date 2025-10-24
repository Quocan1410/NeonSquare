'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Users } from 'lucide-react';
import { Friendship } from '@/types';

interface FriendRequestCardProps {
  request: Friendship;
}

export function FriendRequestCard({ request }: FriendRequestCardProps) {
  const [status, setStatus] = useState(request.status);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const handleAccept = () => {
    setStatus('accepted');
    // Here you would typically make an API call
    console.log('Accepting friend request from:', request.sender.fullName);
  };

  const handleDecline = () => {
    setStatus('declined');
    // Here you would typically make an API call
    console.log('Declining friend request from:', request.sender.fullName);
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
          <AvatarImage src={request.sender.profilePic} alt={request.sender.fullName} />
          <AvatarFallback className="bg-primary text-white font-bold">
            {request.sender.fullName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-forum-primary">{request.sender.fullName}</h3>
              <p className="text-sm text-forum-muted">{request.sender.email}</p>
              <p className="text-xs text-forum-muted">{formatTimeAgo(request.createdAt)}</p>
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
          <Button
            size="sm"
            className="btn-success flex-1"
            onClick={handleAccept}
          >
            <Check className="w-4 h-4 mr-2" />
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="btn-secondary flex-1"
            onClick={handleDecline}
          >
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