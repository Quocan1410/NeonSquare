'use client';

import React from 'react';
import { Heart, ThumbsUp, Zap, Frown, Angry } from 'lucide-react';
import { ReactionType, User } from '@/lib/api';

interface Reaction {
  id: string;
  type: ReactionType;
  user: User;
  createdAt: string;
}

interface ReactionDisplayProps {
  reactions: Reaction[];
  className?: string;
  showCount?: boolean;
  maxDisplay?: number;
}

const reactionIcons = {
  LIKE: ThumbsUp,
  LOVE: Heart,
  WOW: Zap,
  SAD: Frown,
  ANGRY: Angry,
};

const reactionColors = {
  LIKE: 'text-blue-500',
  LOVE: 'text-red-500',
  WOW: 'text-purple-500',
  SAD: 'text-gray-500',
  ANGRY: 'text-orange-500',
};

const reactionLabels = {
  LIKE: 'Like',
  LOVE: 'Love',
  WOW: 'Wow',
  SAD: 'Sad',
  ANGRY: 'Angry',
};

export default function ReactionDisplay({ 
  reactions, 
  className = '', 
  showCount = true,
  maxDisplay = 3 
}: ReactionDisplayProps) {
  // Group reactions by type
  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.type] = (acc[reaction.type] || 0) + 1;
    return acc;
  }, {} as Record<ReactionType, number>);

  // Get unique reaction types
  const reactionTypes = Object.keys(reactionCounts) as ReactionType[];

  if (reactionTypes.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Reaction Icons */}
      <div className="flex items-center -space-x-1">
        {reactionTypes.slice(0, maxDisplay).map((type, index) => {
          const Icon = reactionIcons[type];
          const count = reactionCounts[type];
          
          return (
            <div
              key={type}
              className={`
                flex items-center justify-center w-6 h-6 rounded-full border-2 border-white
                ${reactionColors[type]} bg-white shadow-sm
                ${index > 0 ? '-ml-1' : ''}
              `}
              title={`${reactionLabels[type]}: ${count}`}
            >
              <Icon className="w-3 h-3" />
            </div>
          );
        })}
        
        {/* More reactions indicator */}
        {reactionTypes.length > maxDisplay && (
          <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-gray-100 text-gray-600 text-xs font-medium">
            +{reactionTypes.length - maxDisplay}
          </div>
        )}
      </div>

      {/* Reaction Count */}
      {showCount && (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span className="font-medium">
            {reactions.length}
          </span>
          <span>
            {reactions.length === 1 ? 'reaction' : 'reactions'}
          </span>
        </div>
      )}

      {/* Detailed Breakdown (Optional) */}
      {reactionTypes.length > 1 && (
        <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50 min-w-48">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Reactions</h4>
            {reactionTypes.map((type) => {
              const Icon = reactionIcons[type];
              const count = reactionCounts[type];
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${reactionColors[type]}`} />
                    <span className="text-sm text-gray-700">
                      {reactionLabels[type]}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
