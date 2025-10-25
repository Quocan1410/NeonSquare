'use client';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { OnlineIndicator } from '@/components/ui/online-indicator';
import { ArrowLeft } from 'lucide-react';

interface ConversationsListProps {
  conversations: any[];
  selectedConversation: string;
  setSelectedConversation: (id: string) => void;
  searchQuery: string;
  showArchived: boolean;
  setShowArchived: (val: boolean) => void;
}

export default function ConversationsList({
  conversations,
  selectedConversation,
  setSelectedConversation,
  searchQuery,
  showArchived,
  setShowArchived
}: ConversationsListProps) {
  const filtered = conversations.filter(conv => {
    const matchesSearch = conv.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArchive = showArchived ? conv.isArchived : !conv.isArchived;
    return matchesSearch && matchesArchive;
  });

  const pinned = filtered.filter(conv => conv.isPinned);
  const regular = filtered.filter(conv => !conv.isPinned);

  const renderConversation = (conv: any) => (
    <div
      key={conv.id}
      onClick={() => setSelectedConversation(conv.id)}
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        selectedConversation === conv.id
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted/50'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Avatar className="avatar-forum w-10 h-10">
          <AvatarImage src={conv.user.profilePic} alt={conv.user.fullName} />
          <AvatarFallback className="gradient-primary text-primary-foreground">
            {conv.user.fullName.split(' ').map((n: string[]) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-forum-primary truncate">{conv.user.fullName}</h4>
            <span className="text-xs text-forum-secondary">{conv.time}</span>
          </div>
          <p className="text-sm text-forum-secondary truncate">{conv.lastMessage}</p>
        </div>
        {conv.unreadCount > 0 && <Badge className="bg-primary text-primary-foreground text-xs">{conv.unreadCount}</Badge>}
      </div>
    </div>
  );

  return (
    <div className="w-1/3 border-r border-border flex flex-col">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold text-forum-primary">Messages</h2>

          {/* Show back button only when viewing archived */}
          {showArchived && (
            <button
              onClick={() => setShowArchived(false)}
              className="text-forum-secondary hover:text-forum-primary transition-colors flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {pinned.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs font-medium text-forum-secondary uppercase tracking-wide mb-2 px-2">Pinned</h3>
              <div className="space-y-1">{pinned.map(renderConversation)}</div>
            </div>
          )}

          {regular.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs font-medium text-forum-secondary uppercase tracking-wide mb-2 px-2">
                {showArchived ? 'Archived' : 'All Messages'}
              </h3>
              <div className="space-y-1">{regular.map(renderConversation)}</div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-forum-secondary">No conversations found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
