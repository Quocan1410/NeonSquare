'use client';

import { useMemo, useState, useEffect } from 'react';
import { conversations } from '@/components/chat/data';
import Sidebar from '@/components/chat/Sidebar';
import ConversationsList from '@/components/chat/ConversationsList';
import ChatArea from '@/components/chat/ChatArea';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('current');

  const currentConversation = useMemo(() => conversations.find((c) => c.id === selectedConversation), [selectedConversation]);

  useEffect(() => {
    try {
      const uid = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
      if (uid) setCurrentUserId(uid);
    } catch {
    }
  }, []);

  return (
    <div className="min-h-screen forum-layout">
      <div className="flex">
        <Sidebar conversations={conversations} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setShowArchived={setShowArchived} />
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
            <ChatArea conversationId={selectedConversation} currentUserId={currentUserId} />
          </div>
        </div>
      </div>
    </div>
  );
}