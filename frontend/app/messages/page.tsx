'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { OnlineIndicator } from '@/components/ui/online-indicator';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  MoreHorizontal,
  Send,
  Smile,
  Paperclip,
  Image,
  Phone,
  Video,
  Info,
  Archive,
  Trash2,
  Star,
  StarOff,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';

// Mock data - would need backend API for messages
const conversations = [
  {
    id: '1',
    user: {
      fullName: 'Sarah Wilson',
      username: '@sarahw',
      profilePic: '/avatars/03.png',
      isOnline: true
    },
    lastMessage: 'Thanks for the study tips! They really helped me with my calculus exam.',
    time: '2 minutes ago',
    unreadCount: 2,
    isPinned: true,
    isArchived: false
  },
  {
    id: '2',
    user: {
      fullName: 'Mike Johnson',
      username: '@mikej',
      profilePic: '/avatars/02.png',
      isOnline: false
    },
    lastMessage: 'I have some practice problems that might help. DM me if you want them!',
    time: '1 hour ago',
    unreadCount: 0,
    isPinned: false,
    isArchived: false
  },
  {
    id: '3',
    user: {
      fullName: 'Alex Chen',
      username: '@alexc',
      profilePic: '/avatars/04.png',
      isOnline: true
    },
    lastMessage: 'Hey! Are you going to the tech meetup this weekend?',
    time: '3 hours ago',
    unreadCount: 1,
    isPinned: false,
    isArchived: false
  },
  {
    id: '4',
    user: {
      fullName: 'Emma Davis',
      username: '@emmad',
      profilePic: '/avatars/05.png',
      isOnline: false
    },
    lastMessage: 'The React tutorial you shared was amazing!',
    time: '1 day ago',
    unreadCount: 0,
    isPinned: true,
    isArchived: false
  },
  {
    id: '5',
    user: {
      fullName: 'Tom Brown',
      username: '@tomb',
      profilePic: '/avatars/06.png',
      isOnline: false
    },
    lastMessage: 'Can you help me with the physics assignment?',
    time: '2 days ago',
    unreadCount: 0,
    isPinned: false,
    isArchived: true
  }
];

const messages = [
  {
    id: '1',
    senderId: 'current',
    content: 'Hey Sarah! How did your calculus exam go?',
    time: '10:30 AM',
    isRead: true
  },
  {
    id: '2',
    senderId: '1',
    content: 'It went really well! Thanks for asking. The study tips you shared were super helpful.',
    time: '10:32 AM',
    isRead: true
  },
  {
    id: '3',
    senderId: 'current',
    content: 'That\'s awesome! I\'m so glad they helped. What was the hardest part?',
    time: '10:35 AM',
    isRead: true
  },
  {
    id: '4',
    senderId: '1',
    content: 'The integration by parts problems were tricky, but I managed to work through them step by step.',
    time: '10:37 AM',
    isRead: true
  },
  {
    id: '5',
    senderId: '1',
    content: 'Thanks for the study tips! They really helped me with my calculus exam.',
    time: '2 minutes ago',
    isRead: false
  }
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const currentMessages = messages; // In real app, this would be filtered by conversation

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArchive = showArchived ? conv.isArchived : !conv.isArchived;
    return matchesSearch && matchesArchive;
  });

  const pinnedConversations = filteredConversations.filter(conv => conv.isPinned);
  const regularConversations = filteredConversations.filter(conv => !conv.isPinned);

  return (
    <div className="min-h-screen forum-layout">
      <div className="flex">
        {/* Sidebar */}
        <div className="forum-sidebar scrollbar-forum">
          <div className="flex flex-col h-full">
            <div className="p-6 space-y-6 flex-1">
              {/* Back Button */}
              <Link href="/dashboard" className="flex items-center text-forum-secondary hover:text-forum-primary transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forum-secondary w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 input-forum"
                />
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Button className="w-full btn-primary hover-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  New Message
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full btn-forum"
                  onClick={() => setShowArchived(!showArchived)}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  {showArchived ? 'Show Active' : 'Show Archived'}
                </Button>
              </div>

              {/* Conversation Stats */}
              <div className="forum-card p-4">
                <h4 className="font-semibold text-forum-primary mb-3">Conversations</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-forum-secondary">Total</span>
                    <span className="text-forum-primary font-semibold">{conversations.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forum-secondary">Unread</span>
                    <span className="text-forum-primary font-semibold">
                      {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forum-secondary">Online</span>
                    <span className="text-forum-primary font-semibold">
                      {conversations.filter(conv => conv.user.isOnline).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 forum-main">
          <div className="flex h-screen">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-border">
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-border">
                  <h2 className="text-xl font-semibold text-forum-primary">Messages</h2>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                  {/* Pinned Conversations */}
                  {pinnedConversations.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-xs font-medium text-forum-secondary uppercase tracking-wide mb-2 px-2">
                        Pinned
                      </h3>
                      <div className="space-y-1">
                        {pinnedConversations.map((conversation) => (
                          <div
                            key={conversation.id}
                            onClick={() => setSelectedConversation(conversation.id)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedConversation === conversation.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted/50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <Avatar className="avatar-forum w-10 h-10">
                                  <AvatarImage src={conversation.user.profilePic} alt={conversation.user.fullName} />
                                  <AvatarFallback className="gradient-primary text-primary-foreground">
                                    {conversation.user.fullName.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1">
                                  <OnlineIndicator size="sm" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-forum-primary truncate">
                                    {conversation.user.fullName}
                                  </h4>
                                  <span className="text-xs text-forum-secondary">
                                    {conversation.time}
                                  </span>
                                </div>
                                <p className="text-sm text-forum-secondary truncate">
                                  {conversation.lastMessage}
                                </p>
                              </div>
                              {conversation.unreadCount > 0 && (
                                <Badge className="bg-primary text-primary-foreground text-xs">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Regular Conversations */}
                  {regularConversations.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-xs font-medium text-forum-secondary uppercase tracking-wide mb-2 px-2">
                        {showArchived ? 'Archived' : 'All Messages'}
                      </h3>
                      <div className="space-y-1">
                        {regularConversations.map((conversation) => (
                          <div
                            key={conversation.id}
                            onClick={() => setSelectedConversation(conversation.id)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedConversation === conversation.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted/50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <Avatar className="avatar-forum w-10 h-10">
                                  <AvatarImage src={conversation.user.profilePic} alt={conversation.user.fullName} />
                                  <AvatarFallback className="gradient-primary text-primary-foreground">
                                    {conversation.user.fullName.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1">
                                  <OnlineIndicator size="sm" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-forum-primary truncate">
                                    {conversation.user.fullName}
                                  </h4>
                                  <span className="text-xs text-forum-secondary">
                                    {conversation.time}
                                  </span>
                                </div>
                                <p className="text-sm text-forum-secondary truncate">
                                  {conversation.lastMessage}
                                </p>
                              </div>
                              {conversation.unreadCount > 0 && (
                                <Badge className="bg-primary text-primary-foreground text-xs">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredConversations.length === 0 && (
                    <div className="p-8 text-center">
                      <MessageCircle className="w-12 h-12 text-forum-secondary mx-auto mb-3" />
                      <p className="text-forum-secondary">No conversations found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border bg-background/95 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="avatar-forum w-10 h-10">
                            <AvatarImage src={currentConversation.user.profilePic} alt={currentConversation.user.fullName} />
                            <AvatarFallback className="gradient-primary text-primary-foreground">
                              {currentConversation.user.fullName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1">
                            <OnlineIndicator size="sm" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-forum-primary">{currentConversation.user.fullName}</h3>
                          <p className="text-sm text-forum-secondary">
                            <OnlineIndicator showText={true} size="sm" />
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="btn-forum">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="btn-forum">
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="btn-forum">
                          <Info className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="btn-forum">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === 'current'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-forum-primary'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === 'current' ? 'text-primary-foreground/70' : 'text-forum-secondary'
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border bg-background/95 backdrop-blur">
                    <div className="flex items-center space-x-3">
                      <Button variant="ghost" size="sm" className="btn-forum">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="btn-forum">
                        <Image className="w-4 h-4" />
                      </Button>
                      <div className="flex-1">
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="input-forum"
                        />
                      </div>
                      <Button variant="ghost" size="sm" className="btn-forum">
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Button onClick={handleSendMessage} className="btn-primary">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-forum-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-forum-primary mb-2">Select a conversation</h3>
                    <p className="text-forum-secondary">Choose a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
