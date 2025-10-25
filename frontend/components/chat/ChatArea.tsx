'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';
import { socket, joinConversation, leaveConversation, getHistory, sendMessage as emitMessage, type Message } from '@/lib/socket';

interface ChatAreaProps {
  conversationId: string;
  currentUserId: string;
  className?: string;
}

export default function ChatArea({ conversationId, currentUserId, className }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [connected, setConnected] = useState<boolean>(socket.connected);
  const listRef = useRef<HTMLDivElement>(null);

  const canSend = useMemo(() => text.trim().length > 0 && connected && !isSending, [text, connected, isSending]);

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
    if (!conversationId) return;

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
    if (!trimmed) return;
    const msg: Message = {
      id: `${Date.now()}`,
      conversationId,
      senderId: currentUserId,
      content: trimmed,
      createdAt: new Date().toISOString(),
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

  return (
    <div className={cn('flex h-full flex-col w-full', className)}>
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="text-sm text-muted-foreground">Conversation {conversationId}</div>
        <div className={cn('rounded-full px-2 py-0.5 text-xs', connected ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')}>
          {connected ? 'connected' : 'disconnected'}
        </div>
      </div>

      <div ref={listRef} className="flex-1 space-y-2 overflow-auto px-4 py-3">
        {messages.map((m, idx) => {
          const mine = m.senderId === currentUserId;
          return (
            <div key={m.id ?? `${m.senderId}-${idx}-${m.createdAt ?? ''}`} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
              <div
                className={cn('max-w-[75%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm shadow-sm', mine ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground')}
                title={m.createdAt ? new Date(m.createdAt).toLocaleString() : undefined}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        {messages.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">No messages yet. Say hello!</div>}
      </div>

      <div className="border-t px-3 py-3">
        <div className="flex items-center gap-2">
          <Input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={onKeyDown} placeholder="Type a message..." className="flex-1" aria-label="Message input" />
          <Button onClick={handleSend} disabled={!canSend} className="btn-primary">
            <Send className="mr-1 h-4 w-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}