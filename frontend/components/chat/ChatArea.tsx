// frontend/components/chat/ChatArea.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { OnlineIndicator } from '@/components/ui/online-indicator';
import { Smile, Send, Phone, Video, Info, MoreHorizontal } from 'lucide-react';

import type { Message, ChatMessage } from '@/types';
import type { Dispatch, SetStateAction } from 'react';
import { useChat } from '@/hooks/useChat';
import { apiService } from '@/lib/api';

interface ChatAreaProps {
  conversation: any;
  messages: any[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  newMessage: string;
  setNewMessage: Dispatch<SetStateAction<string>>;
}

export default function ChatArea({
  conversation,
  messages,
  setMessages,
  newMessage,
  setNewMessage,
}: ChatAreaProps) {
  const [myId, setMyId] = useState<string | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const pendingTimers = useRef<Map<string, number>>(new Map());
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMyId(localStorage.getItem('auth_user_id'));
    }
  }, []);

  function mergeById(existing: Message[], incoming: Message[]): Message[] {
    const map = new Map<string, Message>();
    for (const m of existing) map.set(m.id, m);
    for (const m of incoming) map.set(m.id, m);
    return Array.from(map.values()).sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );
  }

  // auto-scroll to bottom on new messages
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const { send } = useChat(String(conversation?.id || ''), (msg: ChatMessage) => {
    const realId = (msg as any).id ? String((msg as any).id) : undefined;
    const sender = (msg as any).senderId ?? (msg as any).fromUserId ?? 'unknown';
    const uiMsg: Message = {
      id: realId ?? (msg.tempId ?? `${Date.now()}`),
      content: msg.content,
      senderId: sender,
      time: (msg as any).sentAt ?? new Date().toISOString(),
      isRead: !!(msg as any).read,
      conversationId: String(conversation?.id || ''),
    };

    setMessages((prev) => {
      if (msg.tempId) {
        let replaced = false;
        const next = prev.map((m) => (m.id === msg.tempId ? ((replaced = true), { ...uiMsg }) : m));
        if (replaced) {
          if (realId) seenIdsRef.current.add(realId);
          const t = pendingTimers.current.get(msg.tempId);
          if (typeof t === 'number') { clearTimeout(t); pendingTimers.current.delete(msg.tempId); }
          return mergeById(next, []);
        }
      }
      if (realId && seenIdsRef.current.has(realId)) return prev;
      if (realId) seenIdsRef.current.add(realId);
      return mergeById(prev, [uiMsg]);
    });
  });

  // initial fetch when switching conversations
  useEffect(() => {
    const convId = String(conversation?.id || '');
    if (!convId) return;

    (async () => {
      try {
        const list = await apiService.chatListMessages(convId, 0, 50);
        const mapped: Message[] = (list || []).map((m: any) => ({
          id: String(m.id ?? `${m.senderId}-${m.sentAt}`),
          content: String(m.content ?? ''),
          senderId: String(m.senderId ?? ''),
          time: String(m.sentAt ?? new Date().toISOString()),
          isRead: Boolean(m.read ?? false),
          conversationId: String(m.conversationId ?? convId),
        }));
        mapped.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
        seenIdsRef.current = new Set(mapped.map((m) => m.id).filter(Boolean));
        setMessages(mapped);
      } catch {
        setMessages([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.id]);

  async function reconcileLatest(convId: string) {
    try {
      const list = await apiService.chatListMessages(convId, 0, 50);
      const mapped: Message[] = (list || []).map((m: any) => ({
        id: String(m.id ?? `${m.senderId}-${m.sentAt}`),
        content: String(m.content ?? ''),
        senderId: String(m.senderId ?? ''),
        time: String(m.sentAt ?? new Date().toISOString()),
        isRead: Boolean(m.read ?? false),
        conversationId: String(m.conversationId ?? convId),
      }));
      setMessages((prev) => mergeById(prev, mapped));
      for (const m of mapped) seenIdsRef.current.add(m.id);
    } catch {}
  }

  const displayName = useMemo(() => {
    const userObj: any = conversation?.user ?? {};
    const name = (userObj.fullName ?? [userObj.firstName, userObj.lastName].filter(Boolean).join(' ').trim()) || '';
    return name || 'Unknown User';
  }, [conversation]);

  const initials = useMemo(
    () => displayName.split(' ').filter(Boolean).map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
    [displayName]
  );

  const avatarUrl: string | undefined = useMemo(() => {
    const u: any = conversation?.user ?? {};
    return u.profilePicUrl ?? u.profilePic ?? undefined;
  }, [conversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversation?.id || !myId) return;

    const sentAt = new Date().toISOString();
    const convId = String(conversation.id);
    const tempId = `tmp-${Date.now()}`;

    setMessages((prev) =>
      mergeById(prev, [{
        id: tempId,
        content: newMessage.trim(),
        senderId: myId,
        time: sentAt,
        isRead: false,
        conversationId: convId,
      }])
    );

    const toUserId: string | undefined = conversation?.user?.id;
    const content = newMessage.trim();
    setNewMessage('');

    try {
      await send(myId, toUserId, content, tempId);
      const timer = window.setTimeout(() => {
        pendingTimers.current.delete(tempId);
        void reconcileLatest(convId);
      }, 2000);
      pendingTimers.current.set(tempId, timer);
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage();
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="text-center">
          <p className="text-forum-secondary">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    // Column must be min-h-0 so the middle scroller can shrink/grow
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header is fixed height */}
      <div className="p-4 border-b border-border bg-background/95 backdrop-blur flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-3">
          <Avatar className="avatar-forum w-10 h-10">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="gradient-primary text-primary-foreground">
              {initials || 'U'}
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

      {/* Messages pane scrolls independently */}
      <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => {
          const mine = myId && message.senderId === myId;
          return (
            <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  mine ? 'bg-primary text-white' : 'bg-muted text-forum-primary'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                <p className={`text-xs mt-1 ${mine ? 'text-white/70' : 'text-forum-secondary'}`}>
                  {new Date(message.time).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input stays fixed at bottom */}
      <div className="p-4 border-t border-border bg-background/95 backdrop-blur flex items-center space-x-3 shrink-0">
        <div className="flex-1">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input-forum"
          />
        </div>
        <Button className="btn-primary" onClick={() => void handleSendMessage()} disabled={!myId}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
