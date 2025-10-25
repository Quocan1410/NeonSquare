// NeonSquare/frontend/components/friends/AddFriendButton.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiService } from '@/lib/api';
import { UserPlus, Check, X } from 'lucide-react';

interface Props {
  meId: string;
  otherId: string;
  className?: string;
}

type UiState = 'NONE' | 'PENDING_OUT' | 'PENDING_IN' | 'ACCEPTED';

export default function AddFriendButton({ meId, otherId, className = '' }: Props) {
  const [sending, setSending] = useState(false);
  const [state, setState] = useState<UiState>('NONE');
  const [requestId, setRequestId] = useState<string | null>(null);

  // Resolve state on mount/when ids change
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!meId || !otherId || meId === otherId) {
        setState('ACCEPTED'); // yourself
        return;
      }
      try {
        const res = await apiService.friendshipStateBetween(meId, otherId);
        if (!cancelled) {
          setState(res.state as UiState);
          setRequestId(res.requestId ?? null);
        }
      } catch {
        if (!cancelled) {
          setState('NONE');
          setRequestId(null);
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [meId, otherId]);

  // Actions
  const send = async () => {
    if (sending || state !== 'NONE') return;
    setSending(true);
    try {
      await apiService.sendFriendRequest(meId, otherId);
      setState('PENDING_OUT');
    } catch (e) {
      console.error('Send friend request failed', e);
    } finally {
      setSending(false);
    }
  };

  const accept = async () => {
    if (!requestId || state !== 'PENDING_IN') return;
    setSending(true);
    try {
      await apiService.acceptFriendRequest(requestId);
      setState('ACCEPTED');
    } catch (e) {
      console.error('Accept friend request failed', e);
    } finally {
      setSending(false);
    }
  };

  const decline = async () => {
    if (!requestId || state !== 'PENDING_IN') return;
    setSending(true);
    try {
      await apiService.rejectFriendRequest(requestId);
      setState('NONE');
      setRequestId(null);
    } catch (e) {
      console.error('Decline friend request failed', e);
    } finally {
      setSending(false);
    }
  };

  // Render
  if (state === 'ACCEPTED') {
    return (
      <Button disabled className={`btn-forum ${className}`}>
        <Check className="w-4 h-4 mr-2" />
        Friends
      </Button>
    );
  }

  if (state === 'PENDING_OUT') {
    return (
      <Button disabled className={`btn-forum ${className}`}>
        <Check className="w-4 h-4 mr-2" />
        Request sent
      </Button>
    );
  }

  if (state === 'PENDING_IN') {
    return (
      <div className={`flex gap-2 ${className}`}>
        <Button onClick={accept} disabled={sending} className="btn-success">
          <Check className="w-4 h-4 mr-2" />
          Accept
        </Button>
        <Button onClick={decline} disabled={sending} variant="outline" className="btn-secondary">
          <X className="w-4 h-4 mr-2" />
          Decline
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={send} disabled={sending} className={`btn-primary hover-glow ${className}`}>
      <UserPlus className="w-4 h-4 mr-2" />
      {sending ? 'Sending…' : 'Add friend'}
    </Button>
  );
}
