'use client';

import { useEffect, useMemo, useState } from 'react';
import { conversations } from '@/components/chat/data';
import Sidebar from '@/components/chat/Sidebar';
import ConversationsList from '@/components/chat/ConversationsList';
import ChatArea from '@/components/chat/ChatArea';

export default function MessagesPage() {
  // Start with no selection so ChatArea shows the empty state until click
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('current');

  const currentConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversation) ?? null,
    [selectedConversation]
  );

  useEffect(() => {
    try {
      const uid = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
      if (uid) setCurrentUserId(uid);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-screen forum-layout">
      <div className="flex">
        <Sidebar
          conversations={conversations}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setShowArchived={setShowArchived}
        />

        <div className="flex-1 forum-main">
          <div className="flex h-screen">
            <ConversationsList
              conversations={conversations}
              selectedConversation={selectedConversation}
              setSelectedConversation={setSelectedConversation}
              searchQuery={searchQuery}
              showArchived={showArchived}
              setShowArchived={setShowArchived}
            />

            <ChatArea
              conversation={currentConversation}
              currentUserId={currentUserId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}