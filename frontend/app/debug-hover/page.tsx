'use client';

import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { ReactionType } from '@/lib/api';

export default function DebugHoverPage() {
  const [isHovering, setIsHovering] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(null);

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
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">Debug Hover Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Current Reaction: {currentReaction || 'None'}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Is Hovering: {isHovering ? 'Yes' : 'No'}
            </p>
          </div>
          
          {/* Like Button with Hover Picker */}
          <div className="relative">
            <button
              onClick={() => setCurrentReaction(currentReaction === 'LIKE' ? null : 'LIKE')}
              onMouseEnter={() => {
                console.log('Hovering Like button');
                setIsHovering(true);
              }}
              onMouseLeave={() => {
                console.log('Leaving Like button');
                setIsHovering(false);
              }}
              className={`
                w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 justify-center
                ${currentReaction === 'LIKE' 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <ThumbsUp className={`w-5 h-5 ${currentReaction === 'LIKE' ? 'fill-current' : ''}`} />
              <span className="font-medium">Like</span>
            </button>
            
            {/* Hover Reaction Picker */}
            {isHovering && (
              <div 
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 z-[9999]"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="flex items-center gap-2">
                  {reactions.map(({ type, icon: Icon, label, color, bgColor }) => (
                    <button
                      key={type}
                      onClick={() => {
                        setCurrentReaction(type);
                        setIsHovering(false);
                      }}
                      className={`
                        group relative p-2 rounded-full transition-all duration-200 transform hover:scale-125
                        ${bgColor} ${color}
                      `}
                      title={label}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
                
                {/* Arrow pointing down */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
