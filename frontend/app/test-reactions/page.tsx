'use client';

import { useState } from 'react';
import { PostCard } from '@/components/posts/PostCard';
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
      type: 'LOVE',
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
      type: 'WOW',
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
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Hướng dẫn sử dụng:</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Hover vào nút "Like"</strong> để hiện tất cả 6 loại reaction (Like, Love, Haha, Wow, Sad, Angry)</li>
              <li>• Click vào bất kỳ reaction nào để chọn</li>
              <li>• Click vào nút "Like" để like/unlike bài viết</li>
              <li>• Click vào các icon reaction chồng lên nhau để mở reaction picker</li>
              <li>• Click vào icon emoji bên cạnh nút Like để mở reaction picker</li>
              <li>• Click vào nút "Comment" để mở modal bình luận</li>
              <li>• Click vào nút "Share" để chia sẻ bài viết</li>
            </ul>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Hover vào nút "Like" để xem tất cả 6 loại reaction có sẵn! Giống Facebook.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
