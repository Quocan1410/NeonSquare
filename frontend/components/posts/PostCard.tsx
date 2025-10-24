'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';

interface PostCardProps {
  post: {
    id: string;
    text: string;
    user: {
      fullName: string;
      profilePic: string;
      isOnline: boolean;
    };
    time: string;
    likes: number;
    comments: number;
    isLiked: boolean;
  };
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="space-y-4">
      {/* Post Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="avatar-forum w-10 h-10">
              <AvatarImage src={post.user.profilePic} alt={post.user.fullName} />
              <AvatarFallback className="bg-primary text-white">
                {post.user.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {post.user.isOnline && (
              <div className="status-online absolute -bottom-1 -right-1"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-forum-primary">{post.user.fullName}</h3>
            <p className="text-sm text-forum-secondary">{post.time}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="btn-forum">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div>
        <p className="text-forum-primary leading-relaxed">{post.text}</p>
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-3 divider-forum">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex items-center space-x-2 btn-forum ${
            isLiked ? 'text-destructive' : 'text-forum-secondary hover:text-destructive'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likeCount}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 btn-forum text-forum-secondary hover:text-primary"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 btn-forum text-forum-secondary hover:text-primary"
        >
          <Share className="w-4 h-4" />
          <span>Share</span>
        </Button>
      </div>
    </div>
  );
}