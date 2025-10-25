// NeonSquare/frontend/components/posts/CreatePost.tsx

'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Globe, Users, Lock, Loader2 } from 'lucide-react';
import { addToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';

export function CreatePost() {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!content.trim()) {
      addToast({
        type: 'warning',
        title: 'Content required',
        description: 'Please write something before posting.'
      });
      return;
    }

    if (!user) {
      addToast({
        type: 'error',
        title: 'Authentication Required',
        description: 'Please log in to create a post',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await apiService.createPost(content, user.id, visibility.toUpperCase());
      
      addToast({
        type: 'success',
        title: 'Post published!',
        description: 'Your post has been shared with the community.'
      });
      
      // Reset form
      setContent('');
      setIsFocused(false);
      
      // Trigger a custom event to refresh posts instead of reloading page
      window.dispatchEvent(new CustomEvent('postCreated'));
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to post',
        description: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVisibilityIcon = (vis: string) => {
    switch (vis) {
      case 'public':
        return <Globe className="w-4 h-4" />;
      case 'friends':
        return <Users className="w-4 h-4" />;
      case 'private':
        return <Lock className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getVisibilityLabel = (vis: string) => {
    switch (vis) {
      case 'public':
        return 'Public';
      case 'friends':
        return 'Friends';
      case 'private':
        return 'Private';
      default:
        return 'Public';
    }
  };

  return (
    <article className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12 ring-2 ring-slate-200 dark:ring-slate-700">
            <AvatarImage 
              src={user?.profilePicUrl} 
              alt={`${user?.firstName} ${user?.lastName}`}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
              {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Share something with your community</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 pb-4">
        <div className="relative">
          <textarea
            placeholder="What's on your mind?"
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 resize-none min-h-[120px] text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 bg-slate-50 dark:bg-slate-700/50 ${
              isFocused 
                ? 'border-blue-400 dark:border-blue-500 bg-white dark:bg-slate-700 shadow-lg' 
                : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
            }`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-400 dark:text-slate-500">
            {content.length}/500
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-end">
          {/* Visibility and Post button */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-sm">
                {getVisibilityIcon(visibility)}
                <span>{getVisibilityLabel(visibility)}</span>
              </div>
              
              <select 
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as 'public' | 'friends' | 'private')}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="public">Public</option>
                <option value="friends">Friends</option>
                <option value="private">Private</option>
              </select>
            </div>
            
            <Button 
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                content.trim() && !isSubmitting
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
              }`}
              disabled={!content.trim() || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post'
              )}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}