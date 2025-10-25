'use client';

import React, { useState } from 'react';
import ReactionButton from './ReactionButton';
import ReactionDisplay from './ReactionDisplay';
import ReactionCounter from './ReactionCounter';
import ReactionPicker from './ReactionPicker';
import { ReactionType } from '@/lib/api';

// Mock data for demo
const mockReactions = [
  {
    id: '1',
    type: 'LIKE' as ReactionType,
    user: {
      id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      isOnline: true,
      lastSeen: 'Online now'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    type: 'LOVE' as ReactionType,
    user: {
      id: 'user2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      isOnline: true,
      lastSeen: 'Online now'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    type: 'WOW' as ReactionType,
    user: {
      id: 'user3',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
      isOnline: false,
      lastSeen: '2 hours ago'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    type: 'WOW' as ReactionType,
    user: {
      id: 'user4',
      firstName: 'Alice',
      lastName: 'Brown',
      email: 'alice@example.com',
      isOnline: true,
      lastSeen: 'Online now'
    },
    createdAt: new Date().toISOString()
  }
];

export default function ReactionDemo() {
  const [reactions, setReactions] = useState(mockReactions);
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleReactionChange = (reaction: ReactionType | null) => {
    setCurrentReaction(reaction);
    
    if (reaction) {
      // Add new reaction
      const newReaction = {
        id: Date.now().toString(),
        type: reaction,
        user: {
          id: 'current-user',
          firstName: 'You',
          lastName: '',
          email: 'you@example.com',
          isOnline: true,
          lastSeen: 'Online now'
        },
        createdAt: new Date().toISOString()
      };
      setReactions(prev => [...prev, newReaction]);
    } else {
      // Remove current user's reaction
      setReactions(prev => prev.filter(r => r.user.id !== 'current-user'));
    }
  };

  const handlePickerSelect = (reaction: ReactionType) => {
    handleReactionChange(reaction);
    setIsPickerOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Reaction Components Demo</h1>
      
      {/* Reaction Button Demo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Reaction Button</h2>
        <div className="flex items-center gap-4">
          <ReactionButton
            postId="demo-post-1"
            userId="current-user"
            currentReaction={currentReaction}
            onReactionChange={handleReactionChange}
          />
          <span className="text-sm text-gray-500">
            Current: {currentReaction || 'None'}
          </span>
        </div>
      </div>

      {/* Reaction Display Demo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Reaction Display</h2>
        <ReactionDisplay 
          reactions={reactions}
          showCount={true}
          maxDisplay={3}
        />
      </div>

      {/* Reaction Counter Demo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Reaction Counter</h2>
        <div className="space-y-4">
          <ReactionCounter 
            reactions={reactions}
            showBreakdown={false}
          />
          <ReactionCounter 
            reactions={reactions}
            showBreakdown={true}
          />
        </div>
      </div>

      {/* Reaction Picker Demo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Reaction Picker</h2>
        <button
          onClick={() => setIsPickerOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Open Reaction Picker
        </button>
        
        <ReactionPicker
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onSelect={handlePickerSelect}
          currentReaction={currentReaction}
        />
      </div>

      {/* Mock Post Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Mock Post Card</h2>
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <div>
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          
          <p className="mb-4 text-gray-800">
            This is a demo post to showcase the reaction system. You can react with different emotions!
          </p>
          
          {/* Reactions Display */}
          {reactions.length > 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <ReactionDisplay 
                reactions={reactions}
                showCount={true}
                maxDisplay={3}
              />
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4">
              <ReactionButton
                postId="demo-post-2"
                userId="current-user"
                currentReaction={currentReaction}
                onReactionChange={handleReactionChange}
              />
              <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm font-medium">Comment</span>
              </button>
            </div>
            
            <ReactionCounter 
              reactions={reactions}
              showBreakdown={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
