'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, MoreHorizontal, Clock } from 'lucide-react';
import { Comment } from '@/lib/api';

interface CommentCardProps {
  comment: Comment;
  onReply?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
}

export function CommentCard({ comment, onReply, onLike }: CommentCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(comment.id);
  };

  const handleReply = () => {
    onReply?.(comment.id);
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="group bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
      <div className="flex items-start space-x-3">
        <Avatar className="w-8 h-8 ring-1 ring-slate-200 dark:ring-slate-600">
          <AvatarImage 
            src={comment.author?.profilePicUrl} 
            alt={`${comment.author?.firstName || ''} ${comment.author?.lastName || ''}`}
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium text-sm">
            {comment.author ? `${comment.author.firstName.charAt(0)}${comment.author.lastName.charAt(0)}` : 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              {comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : 'Unknown User'}
            </h4>
            <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(comment.createdAt)}</span>
            </div>
          </div>
          
          <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed mb-3">
            {comment.content}
          </p>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-1 px-2 py-1 h-auto text-xs rounded-full transition-all duration-200 ${
                isLiked 
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
            >
              <Heart className={`w-3 h-3 transition-transform duration-200 ${isLiked ? 'fill-current scale-110' : 'hover:scale-110'}`} />
              <span className="font-medium">{likeCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReply}
              className="flex items-center space-x-1 px-2 py-1 h-auto text-xs rounded-full text-slate-600 dark:text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
            >
              <MessageCircle className="w-3 h-3 hover:scale-110 transition-transform duration-200" />
              <span>Reply</span>
            </Button>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full p-1 h-auto"
        >
          <MoreHorizontal className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
