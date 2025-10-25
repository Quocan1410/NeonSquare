// NeonSquare/frontend/components/posts/ReactionButton.tsx
'use client';

import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { ReactionType, apiService } from '@/lib/api';

interface ReactionButtonProps {
  postId: string;
  userId: string;
  currentReaction?: ReactionType | null;
  onReactionChange?: (reaction: ReactionType | null) => void;
  className?: string;
}

export default function ReactionButton({
  postId,
  userId,
  currentReaction,
  onReactionChange,
  className = ''
}: ReactionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const toggleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (currentReaction === 'LIKE') {
        await apiService.removeReaction(postId, userId);
        onReactionChange?.(null);
      } else {
        await apiService.addReaction(postId, 'LIKE', userId);
        onReactionChange?.('LIKE');
      }
    } catch (e) {
      console.error('Toggle like failed', e);
      onReactionChange?.(currentReaction === 'LIKE' ? null : 'LIKE');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={isLoading}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
        ${currentReaction === 'LIKE'
          ? 'text-blue-600 bg-blue-50 border-2 border-blue-200'
          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}
        ${className}
      `}
    >
      <ThumbsUp className="w-5 h-5" />
      <span className="text-sm font-medium">{currentReaction === 'LIKE' ? 'Liked' : 'Like'}</span>
    </button>
  );
}
