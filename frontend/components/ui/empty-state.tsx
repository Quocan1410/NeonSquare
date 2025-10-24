'use client';

import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="mx-auto w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-12 h-12 text-forum-secondary" />
      </div>
      <h3 className="text-lg font-semibold text-forum-primary mb-2">{title}</h3>
      <p className="text-forum-secondary mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="btn-primary hover-glow">
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Specific empty states for common scenarios
export function NoPostsEmptyState() {
  return (
    <EmptyState
      icon={require('lucide-react').FileText}
      title="No posts yet"
      description="Be the first to share something with the community!"
      action={{
        label: "Create Post",
        onClick: () => console.log("Create post clicked")
      }}
    />
  );
}

export function NoMessagesEmptyState() {
  return (
    <EmptyState
      icon={require('lucide-react').MessageCircle}
      title="No messages yet"
      description="Start a conversation with someone from the community!"
      action={{
        label: "Find People",
        onClick: () => console.log("Find people clicked")
      }}
    />
  );
}

export function NoNotificationsEmptyState() {
  return (
    <EmptyState
      icon={require('lucide-react').Bell}
      title="All caught up!"
      description="You have no new notifications. Check back later for updates."
    />
  );
}

export function NoSearchResultsEmptyState() {
  return (
    <EmptyState
      icon={require('lucide-react').Search}
      title="No results found"
      description="Try adjusting your search terms or filters to find what you're looking for."
    />
  );
}
