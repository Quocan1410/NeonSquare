// NeonSquare/frontend/components/posts/ReactionCounter.tsx
'use client';

import React from 'react';
import { ReactionType } from '@/lib/api';

interface ReactionCounterProps {
  reactions: Array<{
    id: string;
    type: ReactionType;
    user: { id: string; firstName: string; lastName: string };
  }>;
  className?: string;
  showBreakdown?: boolean;
}

const reactionLabels = {
  LIKE: 'Like',
  LOVE: 'Love',
  WOW: 'Wow',
  SAD: 'Sad',
  ANGRY: 'Angry',
};

export default function ReactionCounter({ 
  reactions, 
  className = '',
  showBreakdown = false 
}: ReactionCounterProps) {
  // Count reactions by type
  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.type] = (acc[reaction.type] || 0) + 1;
    return acc;
  }, {} as Record<ReactionType, number>);

  // Get total count
  const totalCount = reactions.length;

  // Get most popular reaction
  const mostPopular = Object.entries(reactionCounts).reduce(
    (max, [type, count]) => count > max.count ? { type: type as ReactionType, count } : max,
    { type: 'LIKE' as ReactionType, count: 0 }
  );

  if (totalCount === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Total Count */}
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <span className="font-medium">{totalCount}</span>
        <span>{totalCount === 1 ? 'reaction' : 'reactions'}</span>
      </div>

      {/* Most Popular Reaction */}
      {mostPopular.count > 0 && (
        <div className="text-sm text-gray-500">
          <span>Most: </span>
          <span className="font-medium">
            {reactionLabels[mostPopular.type]} ({mostPopular.count})
          </span>
        </div>
      )}

      {/* Detailed Breakdown */}
      {showBreakdown && Object.keys(reactionCounts).length > 1 && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {Object.entries(reactionCounts).map(([type, count]) => (
            <span key={type}>
              {reactionLabels[type as ReactionType]}: {count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
