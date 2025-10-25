import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Archive, Plus, ArrowLeft } from 'lucide-react';
import { conversations as allConversations } from './data';

interface SidebarProps {
  conversations: typeof allConversations;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setShowArchived: (b: boolean) => void;
}

export default function Sidebar({
  conversations,
  searchQuery,
  setSearchQuery,
  setShowArchived
}: SidebarProps) {

  return (
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
              onClick={() => setShowArchived(true)}
            >
              <Archive className="w-4 h-4 mr-2" />
              Show Archived
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
  );
}
