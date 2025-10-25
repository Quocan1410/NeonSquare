// NeonSquare/frontend/components/posts/ReactionHoverPicker.tsx
'use client';

import React from 'react';
import { ThumbsUp } from 'lucide-react';
import { ReactionType } from '@/lib/api';

interface ReactionHoverPickerProps {
  isVisible: boolean;
  onSelect: (reaction: ReactionType) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  className?: string;
}

const reactions: Array<{
  type: ReactionType;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  animation: string;
}> = [
  {
    type: 'LIKE',
    icon: ThumbsUp,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    animation: 'animate-bounce'
  },
];

export default function ReactionHoverPicker({
  isVisible,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  className = '',
}: ReactionHoverPickerProps) {
  console.log('ReactionHoverPicker isVisible:', isVisible);
  
  if (!isVisible) return null;

  return (
    <div 
      className={`
        absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 z-[9999]
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}
        ${className}
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center gap-1">
        {reactions.map(({ type, icon: Icon, color, bgColor, animation }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`
              group relative p-3 rounded-full transition-all duration-200 transform hover:scale-125
              ${bgColor} ${color}
              ${animation}
            `}
          >
            <Icon className="w-6 h-6" />
          </button>
        ))}
      </div>
      
      {/* Arrow pointing down */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
    </div>
  );
}
