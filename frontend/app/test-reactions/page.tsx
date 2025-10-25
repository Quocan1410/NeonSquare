'use client';

import { useState } from 'react';
import { PostCard } from '@/components/posts/PostCard';
import ReactionBar from '@/components/posts/ReactionBar';
import { Post, ReactionType } from '@/lib/api';

// Mock data for testing
const mockPost: Post = {
  id: 'post-1',
  text: 'Đây là một bài viết test để kiểm tra hệ thống reaction. Bạn có thể thử các loại reaction khác nhau!',
  author: {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    isOnline: true,
    lastSeen: 'Online now'
  },
  comments: [],
  reactions: [
    {
      id: 'reaction-1',
      type: 'LIKE',
      user: {
        id: 'user-2',
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        isOnline: true,
        lastSeen: 'Online now'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'reaction-2',
      type: 'LIKE',
      user: {
        id: 'user-3',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        isOnline: false,
        lastSeen: '2 hours ago'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'reaction-4',
      type: 'LIKE',
      user: {
        id: 'user-5',
        firstName: 'Diana',
        lastName: 'Wilson',
        email: 'diana@example.com',
        isOnline: true,
        lastSeen: 'Online now'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'reaction-5',
      type: 'LIKE',
      user: {
        id: 'user-6',
        firstName: 'Eve',
        lastName: 'Davis',
        email: 'eve@example.com',
        isOnline: false,
        lastSeen: '1 hour ago'
      },
      createdAt: new Date().toISOString()
    }
  ],
  visibility: 'PUBLIC',
  imageUrls: [],
  commentCount: 3,
  reactionCount: 5
};

export default function TestReactionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Test Reaction UI
        </h1>
        
        <div className="space-y-6">
          <PostCard post={mockPost} />
          
          {/* Standalone Reaction Bar Demo */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Reaction Bar Demo</h2>
            <ReactionBar
              postId="demo-post"
              userId="current-user"
              currentReaction={null}
              onReactionChange={(reaction) => console.log('Selected reaction:', reaction)}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Hướng dẫn sử dụng:</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Click vào nút Like</strong> trong thanh reaction để like/unlike</li>
              <li>• <strong>Click vào nút "Like"</strong> ở dưới để like/unlike bài viết</li>
              <li>• <strong>Click vào nút "Comment"</strong> để mở modal bình luận</li>
            </ul>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Đơn giản chỉ có Like! Click để like, click lần 2 để unlike.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
