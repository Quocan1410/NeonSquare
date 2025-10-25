// NeonSquare/frontend/components/posts/ReactionBar.tsx
'use client';

import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { ReactionType, apiService } from '@/lib/api';

interface ReactionBarProps {
  postId: string;
  userId: string;
  currentReaction?: ReactionType | null;
  onReactionChange?: (reaction: ReactionType | null) => void;
  className?: string;
}

export default function ReactionBar({
  postId,
  userId,
  currentReaction,
  onReactionChange,
  className = ''
}: ReactionBarProps) {
  const [isHovering, setIsHovering] = useState(false);

  const handleLikeClick = async () => {
    try {
      if (currentReaction === 'LIKE') {
        await apiService.removeReaction(postId, userId);
        onReactionChange?.(null);
      } else {
        await apiService.addReaction(postId, 'LIKE', userId);
        onReactionChange?.('LIKE');
      }
    } catch (error) {
      console.error('Error handling like:', error);
      // Soft fallback
      onReactionChange?.(currentReaction === 'LIKE' ? null : 'LIKE');
    }
  };

  return (
    <div
      className={`
        bg-gray-800 rounded-lg p-3 transition-all duration-300
        ${isHovering ? 'opacity-100 scale-100' : 'opacity-90 scale-95'}
        ${className}
      `}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center justify-center">
        <button
          onClick={handleLikeClick}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110
            ${currentReaction === 'LIKE'
              ? 'bg-blue-500 text-white shadow-lg ring-2 ring-white ring-opacity-50'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'}
          `}
        >
          <ThumbsUp className={`w-6 h-6 ${currentReaction === 'LIKE' ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
}
