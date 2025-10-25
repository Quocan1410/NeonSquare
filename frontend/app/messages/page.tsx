// frontend/app/messages/page.tsx
'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import ChatArea from '@/components/chat/ChatArea';
import type { Message } from '@/types';
import { apiService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function MessagesClient() {
  const { user } = useAuth();
  const meId =
    user?.id || (typeof window !== 'undefined' ? localStorage.getItem('auth_user_id') : null);
  const params = useSearchParams();

  const [conversations, setConversations] = useState<
    Array<{ id: string; userAId: string; userBId: string }>
  >([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<any | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!meId) return;

    const init = async () => {
      try {
        const convs = await apiService.chatListConversations(meId);
        setConversations(convs || []);
        const fromUrl = params.get('c');

        const selected =
          (fromUrl && convs.find((c) => String(c.id) === String(fromUrl))?.id) ||
          (convs[0]?.id ?? null);

        setSelectedConversation(selected ? String(selected) : null);
      } catch {
        setConversations([]);
      }
    };

    void init();
  }, [meId, params]);

  useEffect(() => {
    const load = async () => {
      if (!selectedConversation) return;

      try {
        const list = await apiService.chatListMessages(selectedConversation, 0, 50);
        const mapped: Message[] = (list || []).map((m: any) => ({
          id: String(m.id ?? `${m.senderId}-${m.sentAt}`),
          content: String(m.content ?? ''),
          senderId: String(m.senderId ?? ''),
          time: String(m.sentAt ?? new Date().toISOString()),
          isRead: Boolean(m.read ?? false),
          conversationId: String(m.conversationId ?? selectedConversation),
        }));
        mapped.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
        setMessages(mapped);
      } catch {
        setMessages([]);
      }

      try {
        const conv = conversations.find((c) => String(c.id) === String(selectedConversation));
        if (conv && meId) {
          const otherId =
            String(conv.userAId) === String(meId) ? String(conv.userBId) : String(conv.userAId);
          const userData = await apiService.getUser(otherId);
          setOtherUser({
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            fullName: `${userData.firstName} ${userData.lastName}`.trim(),
            profilePicUrl: userData.profilePicUrl,
          });
        } else {
          setOtherUser(null);
        }
      } catch {
        setOtherUser(null);
      }
    };

    void load();
  }, [selectedConversation, conversations, meId]);

  const conversation = useMemo(() => {
    if (!selectedConversation) return null;
    return {
      id: selectedConversation,
      user: otherUser ?? { fullName: 'Unknown User', profilePic: '' },
    };
  }, [selectedConversation, otherUser]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Page content fills viewport below your site header (64px) */}
      <div className="border-b border-border px-4 py-3 flex items-center justify-between bg-background/95 backdrop-blur shrink-0">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted transition-colors text-forum-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
          <h1 className="font-semibold text-forum-primary">Messages</h1>
        </div>
      </div>

      {/* Main split area must have min-h-0 so children can scroll */}
      <div className="flex flex-1 min-h-0">
        {/* Left list scrolls independently */}
        <aside className="w-60 border-r border-border p-3 space-y-2 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="text-sm text-forum-secondary px-2">No conversations yet</div>
          ) : (
            conversations.map((c) => {
              const isActive = String(c.id) === String(selectedConversation);
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedConversation(String(c.id))}
                  className={`w-full text-left px-3 py-2 rounded ${
                    isActive ? 'bg-muted' : 'hover:bg-muted/60'
                  }`}
                >
                  Conversation {String(c.id).slice(0, 8)}…
                </button>
              );
            })
          )}
        </aside>

        {/* Right chat column must also have min-h-0 */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatArea
            conversation={conversation}
            messages={messages}
            setMessages={setMessages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
          />
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading messages…</div>}>
      <MessagesClient />
    </Suspense>
  );
}
