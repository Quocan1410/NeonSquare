'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';

interface CommentFormProps {
  postId: string;
  parentCommentId?: string;
  onCommentAdded?: () => void;
  placeholder?: string;
  showAvatar?: boolean;
}

export function CommentForm({ 
  postId, 
  parentCommentId, 
  onCommentAdded, 
  placeholder = "Write a comment...",
  showAvatar = true 
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    if (!user) return;

    setIsSubmitting(true);
    
    try {
      if (parentCommentId) {
        // Reply to comment
        await apiService.createReply(parentCommentId, content, user.id);
      } else {
        // Comment on post
        await apiService.createComment(postId, content, user.id);
      }
      
      setContent('');
      setIsFocused(false);
      onCommentAdded?.();
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-start space-x-3">
      {showAvatar && (
        <Avatar className="w-8 h-8 ring-1 ring-slate-200 dark:ring-slate-600">
          <AvatarImage 
            src={user?.profilePicUrl} 
            alt={`${user?.firstName} ${user?.lastName}`}
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium text-sm">
            {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'U'}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex-1">
        <div className="relative">
          <textarea
            placeholder={placeholder}
            className={`w-full p-3 rounded-xl border-2 transition-all duration-200 resize-none min-h-[40px] max-h-32 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 bg-slate-50 dark:bg-slate-700/50 text-sm ${
              isFocused 
                ? 'border-blue-400 dark:border-blue-500 bg-white dark:bg-slate-700 shadow-sm' 
                : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
            }`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyPress={handleKeyPress}
            rows={1}
          />
          
          {content.trim() && (
            <div className="absolute bottom-2 right-2 flex items-center space-x-2">
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {content.length}/500
              </span>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!content.trim() || isSubmitting}
                className={`h-7 px-3 rounded-full transition-all duration-200 ${
                  content.trim() && !isSubmitting
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md transform hover:scale-105'
                    : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
