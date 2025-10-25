'use client';

import React, { useState } from 'react';
import { Heart, ThumbsUp, Zap, Frown, Angry, X } from 'lucide-react';
import { ReactionType } from '@/lib/api';

interface ReactionPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (reaction: ReactionType) => void;
  currentReaction?: ReactionType | null;
  className?: string;
}

const reactions: Array<{
  type: ReactionType;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  bgColor: string;
}> = [
  {
    type: 'LIKE',
    icon: ThumbsUp,
    label: 'Like',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
  },
  {
    type: 'LOVE',
    icon: Heart,
    label: 'Love',
    color: 'text-red-500',
    bgColor: 'bg-red-50 hover:bg-red-100',
  },
  {
    type: 'WOW',
    icon: Zap,
    label: 'Wow',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
  },
  {
    type: 'SAD',
    icon: Frown,
    label: 'Sad',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50 hover:bg-gray-100',
  },
  {
    type: 'ANGRY',
    icon: Angry,
    label: 'Angry',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
  },
];

export default function ReactionPicker({
  isOpen,
  onClose,
  onSelect,
  currentReaction,
  className = '',
}: ReactionPickerProps) {
  const [hoveredReaction, setHoveredReaction] = useState<ReactionType | null>(null);

  if (!isOpen) return null;

  const handleReactionSelect = (reaction: ReactionType) => {
    onSelect(reaction);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 z-40"
        onClick={onClose}
      />
      
      {/* Picker Modal */}
      <div className={`
        fixed inset-0 flex items-center justify-center z-50 p-4
        ${className}
      `}>
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-w-sm w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Choose a reaction
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Reaction Grid */}
          <div className="grid grid-cols-3 gap-3">
            {reactions.map(({ type, icon: Icon, label, color, bgColor }) => {
              const isSelected = currentReaction === type;
              const isHovered = hoveredReaction === type;
              
              return (
                <button
                  key={type}
                  onClick={() => handleReactionSelect(type)}
                  onMouseEnter={() => setHoveredReaction(type)}
                  onMouseLeave={() => setHoveredReaction(null)}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200
                    ${bgColor}
                    ${isSelected 
                      ? `${color} ring-2 ring-current ring-opacity-50` 
                      : 'text-gray-600 hover:text-gray-900'
                    }
                    ${isHovered ? 'scale-105' : 'scale-100'}
                    transform hover:scale-105 active:scale-95
                  `}
                >
                  <Icon className={`w-8 h-8 ${isSelected ? color : ''}`} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Current Selection Info */}
          {currentReaction && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Current reaction: <span className="font-medium">
                  {reactions.find(r => r.type === currentReaction)?.label}
                </span>
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
