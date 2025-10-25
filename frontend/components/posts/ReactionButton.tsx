'use client';

import React, { useState } from 'react';
import { Heart, ThumbsUp, Zap, Frown, Angry } from 'lucide-react';
import { ReactionType } from '@/lib/api';
import { apiService } from '@/lib/api';

interface ReactionButtonProps {
  postId: string;
  userId: string;
  currentReaction?: ReactionType | null;
  onReactionChange?: (reaction: ReactionType | null) => void;
  className?: string;
}

const reactionIcons = {
  LIKE: ThumbsUp,
  LOVE: Heart,
  WOW: Zap,
  SAD: Frown,
  ANGRY: Angry,
};

const reactionColors = {
  LIKE: 'text-blue-500 hover:text-blue-600',
  LOVE: 'text-red-500 hover:text-red-600',
  WOW: 'text-purple-500 hover:text-purple-600',
  SAD: 'text-gray-500 hover:text-gray-600',
  ANGRY: 'text-orange-500 hover:text-orange-600',
};

const reactionLabels = {
  LIKE: 'Like',
  LOVE: 'Love',
  WOW: 'Wow',
  SAD: 'Sad',
  ANGRY: 'Angry',
};

export default function ReactionButton({ 
  postId, 
  userId, 
  currentReaction, 
  onReactionChange,
  className = '' 
}: ReactionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReaction = async (reactionType: ReactionType) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // If clicking the same reaction, remove it
      if (currentReaction === reactionType) {
        await removeReaction();
      } else {
        await addReaction(reactionType);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const addReaction = async (reactionType: ReactionType) => {
    try {
      await apiService.addReaction(postId, reactionType, userId);
      onReactionChange?.(reactionType);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const removeReaction = async () => {
    try {
      await apiService.removeReaction(postId, userId);
      onReactionChange?.(null);
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  };

  const CurrentIcon = currentReaction ? reactionIcons[currentReaction] : ThumbsUp;
  const currentColor = currentReaction ? reactionColors[currentReaction] : 'text-gray-400 hover:text-gray-600';

  return (
    <div className={`relative ${className}`}>
      {/* Main Reaction Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
          ${currentReaction 
            ? `${currentColor} bg-opacity-10 border-2 border-current` 
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <CurrentIcon className="w-5 h-5" />
        <span className="text-sm font-medium">
          {currentReaction ? reactionLabels[currentReaction] : 'React'}
        </span>
      </button>

      {/* Reaction Picker Modal */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 p-2 z-50">
          <div className="flex items-center gap-1">
            {Object.entries(reactionIcons).map(([type, Icon]) => {
              const reactionType = type as ReactionType;
              const isSelected = currentReaction === reactionType;
              
              return (
                <button
                  key={type}
                  onClick={() => handleReaction(reactionType)}
                  disabled={isLoading}
                  className={`
                    p-2 rounded-full transition-all duration-200 transform hover:scale-110
                    ${isSelected 
                      ? `${reactionColors[reactionType]} bg-opacity-20` 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  title={reactionLabels[reactionType]}
                >
                  <Icon className="w-6 h-6" />
                </button>
              );
            })}
          </div>
          
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
