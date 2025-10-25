'use client';

import { useState, useEffect} from 'react';
import { conversations } from '@/components/chat/data';
import Sidebar from '@/components/chat/Sidebar';
import ConversationsList from '@/components/chat/ConversationsList';
import ChatArea from '@/components/chat/ChatArea';
import { Message } from '@/types'

import { socket } from '@/lib/socket';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  useEffect(() => {
    setMessages([]);
  }, [selectedConversation]);

  useEffect(() => {
    socket.on('receiveMessage', (message: Message) => {
      if (message.conversationId === selectedConversation) {
        setMessages(prev => [...prev, message]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedConversation]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected with id:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
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
              messages={messages}
              setMessages={setMessages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
