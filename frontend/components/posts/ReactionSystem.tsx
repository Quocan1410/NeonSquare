'use client';

import React, { useState, useEffect } from 'react';
import { ThumbsUp, MessageCircle, Heart } from 'lucide-react';
import { ReactionType, apiService } from '@/lib/api';

interface Reaction {
  id: string;
  type: ReactionType;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isOnline: boolean;
    lastSeen: string;
  };
  createdAt: string;
}

interface ReactionSystemProps {
  postId: string;
  userId: string;
  initialReactions?: Reaction[];
  className?: string;
}

const reactionConfig = {
  LIKE: {
    icon: ThumbsUp,
    label: 'Like',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    activeColor: 'text-blue-600',
    activeBgColor: 'bg-blue-100',
    hoverColor: 'hover:text-blue-600',
  },
};

export default function ReactionSystem({ 
  postId, 
  userId, 
  initialReactions = [], 
  className = '' 
}: ReactionSystemProps) {
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions);
  const [isLoading, setIsLoading] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);

  // Load reactions from backend
  useEffect(() => {
    const loadReactions = async () => {
      try {
        const postReactions = await apiService.getPostReactions(postId);
        setReactions(postReactions);
      } catch (error) {
        console.error('Error loading reactions:', error);
        setReactions(initialReactions);
      }
    };

    loadReactions();
  }, [postId, initialReactions]);

  // Get current user's reaction
  const currentUserReaction = reactions.find(r => r.user.id === userId);
  const otherReactions = reactions.filter(r => r.user.id !== userId);
  const likeReactions = reactions.filter(r => r.type === 'LIKE');

  // Handle like click with animation
  const handleLikeClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setLikeAnimation(true);
    
    try {
      if (currentUserReaction?.type === 'LIKE') {
        // Remove like
        await apiService.removeReaction(postId, userId);
        setReactions(prev => prev.filter(r => r.id !== currentUserReaction.id));
      } else {
        // Add like
        const newReaction = await apiService.addReaction(postId, 'LIKE', userId);
        
        // Remove any existing reaction from current user
        const filteredReactions = reactions.filter(r => r.user.id !== userId);
        
        // Add new reaction
        setReactions([...filteredReactions, newReaction]);
      }
    } catch (error) {
      console.error('Error handling like:', error);
    } finally {
      setIsLoading(false);
      // Reset animation after a short delay
      setTimeout(() => setLikeAnimation(false), 300);
    }
  };

  // Get like count
  const likeCount = likeReactions.length;
  const isLiked = currentUserReaction?.type === 'LIKE';

  // Format like summary text
  const getLikeSummaryText = () => {
    if (likeCount === 0) return null;
    
    const otherLikes = likeReactions.filter(r => r.user.id !== userId);
    
    if (isLiked && otherLikes.length === 0) {
      return "You liked this";
    } else if (isLiked && otherLikes.length > 0) {
      if (otherLikes.length === 1) {
        return `You and ${otherLikes[0].user.firstName} ${otherLikes[0].user.lastName} liked this`;
      } else {
        return `You and ${otherLikes.length} others liked this`;
      }
    } else {
      if (otherLikes.length === 1) {
        return `${otherLikes[0].user.firstName} ${otherLikes[0].user.lastName} liked this`;
      } else {
        return `${otherLikes.length} people liked this`;
      }
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Like Summary */}
      {likeCount > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-blue-100 dark:border-slate-600">
          <div className="flex items-center space-x-3">
            {/* Like Icon with animation */}
            <div className={`w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center transition-all duration-200 ${likeAnimation ? 'scale-110' : ''}`}>
              <ThumbsUp className={`w-4 h-4 text-blue-600 dark:text-blue-400 ${likeAnimation ? 'animate-bounce' : ''}`} />
            </div>
            
            {/* Like Text */}
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">{getLikeSummaryText()}</span>
            </div>
          </div>
          
          {/* Like Count Badge */}
          <div className="flex items-center space-x-1 px-3 py-1 bg-white dark:bg-slate-600 rounded-full border border-blue-200 dark:border-slate-500">
            <Heart className="w-3 h-3 text-red-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {likeCount}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            disabled={isLoading}
            className={`
              group flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 flex-1 justify-center
              ${isLiked 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
              ${likeAnimation ? 'animate-pulse' : ''}
            `}
          >
            <ThumbsUp className={`w-5 h-5 transition-all duration-200 ${isLiked ? 'fill-current' : ''} ${likeAnimation ? 'animate-bounce' : ''}`} />
            <span className="font-semibold text-sm">
              {isLiked ? 'Liked' : 'Like'}
            </span>
            {likeCount > 0 && (
              <span className={`text-xs px-2 py-1 rounded-full transition-all duration-200 ${
                isLiked 
                  ? 'bg-white/20 text-white' 
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
              }`}>
                {likeCount}
              </span>
            )}
          </button>
          
          {/* Comment Button */}
          <button className="group flex items-center space-x-2 px-6 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-gray-200 transition-all duration-300 flex-1 justify-center hover:scale-105 active:scale-95">
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold text-sm">Comment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
