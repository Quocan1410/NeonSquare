'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Info, MoreHorizontal, Phone, Send, Video } from 'lucide-react';
import {
  socket,
  joinConversation,
  leaveConversation,
  getHistory,
  sendMessage as emitMessage,
} from '@/lib/socket';
import type { Message, Conversation } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { OnlineIndicator } from '../ui/online-indicator';

interface ChatAreaProps {
  conversation?: Conversation | null;
  currentUserId: string;
  className?: string;
}

export default function ChatArea({ conversation, currentUserId, className }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [connected, setConnected] = useState<boolean>(socket.connected);
  const listRef = useRef<HTMLDivElement>(null);

  const conversationId = conversation?.id ?? '';
  const displayName = conversation?.user?.fullName ?? 'Unknown User';
  const avatarUrl = conversation?.user?.profilePic ?? '';
  const initials =
    (conversation?.user?.fullName ?? 'User')
      .split(' ')
      .map((part) => part[0])
      .join('') || 'U';

  const canSend = useMemo(
    () => text.trim().length > 0 && connected && !isSending && !!conversationId,
    [text, connected, isSending, conversationId]
  );

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    if (!socket.connected) socket.connect();
    setConnected(socket.connected);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setMessages([]);
    joinConversation(conversationId, currentUserId);

    getHistory(conversationId, (history) => {
      setMessages(Array.isArray(history) ? history : []);
      const el = listRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });

    const onReceive = (message: Message) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on('receiveMessage', onReceive);

    return () => {
      socket.off('receiveMessage', onReceive);
      leaveConversation(conversationId, currentUserId);
    };
  }, [conversationId, currentUserId]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || !conversationId) return;

    const msg: Message = {
      id: `${Date.now()}`,
      conversationId,
      senderId: currentUserId,
      content: trimmed,
      time: new Date().toISOString(),
      isRead: false,
    };
    setIsSending(true);
    setMessages((prev) => [...prev, msg]);
    setText('');
    emitMessage(msg);
    window.setTimeout(() => setIsSending(false), 150);
  }, [conversationId, currentUserId, text]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) handleSend();
    }
  };

  if (!conversationId) {
    return (
      <div className={cn('flex-1 flex items-center justify-center text-sm text-muted-foreground', className)}>
        Select a conversation to start chatting.
      </div>
    );
  }

  return (
    <div className={cn('flex-1 flex flex-col', className)}>
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-background/95 backdrop-blur flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Avatar className="avatar-forum w-10 h-10">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="gradient-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-forum-primary">{displayName}</h3>
            <OnlineIndicator showText={true} size="sm" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {[Phone, Video, Info, MoreHorizontal].map((Icon, i) => (
            <Button key={i} variant="ghost" size="sm" className="btn-forum">
              <Icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>

      <div ref={listRef} className="flex-1 space-y-2 overflow-auto px-4 py-3">
        {messages.map((m, idx) => {
          const mine = m.senderId === currentUserId;
          return (
            <div
              key={m.id ?? `${m.senderId}-${idx}-${m.time ?? ''}`}
              className={cn('flex', mine ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[75%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm shadow-sm',
                  mine ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                )}
                title={m.time ? new Date(m.time).toLocaleString() : undefined}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No messages yet. Say hello!
          </div>
        )}
      </div>

      <div className="border-t px-3 py-3">
        <div className="flex items-center gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
            className="flex-1"
            aria-label="Message input"
          />
          <Button onClick={handleSend} disabled={!canSend} className="btn-primary">
            <Send className="mr-1 h-4 w-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}