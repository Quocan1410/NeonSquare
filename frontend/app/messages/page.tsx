'use client';

import { useState } from 'react';
import { conversations, messages } from '@/components/chat/data';
import Sidebar from '@/components/chat/Sidebar';
import ConversationsList from '@/components/chat/ConversationsList';
import ChatArea from '@/components/chat/ChatArea';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const currentMessages = messages; 

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
              messages={currentMessages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
