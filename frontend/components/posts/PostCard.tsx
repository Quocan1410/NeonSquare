'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { OnlineIndicator } from '@/components/ui/online-indicator';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { Post } from '@/lib/api';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.reactionCount);

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
              <AvatarImage src={post.author.profilePicUrl} alt={`${post.author.firstName} ${post.author.lastName}`} />
              <AvatarFallback className="bg-primary text-white">
                {post.author.firstName.charAt(0)}{post.author.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1">
              <OnlineIndicator size="sm" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-forum-primary">
              {post.author.firstName} {post.author.lastName}
            </h3>
            <p className="text-sm text-forum-secondary">{post.updateAt}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="btn-forum">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div>
        <Link href={`/post/${post.id}`} className="hover:opacity-90 transition-opacity">
          <p className="text-forum-primary leading-relaxed cursor-pointer">{post.text}</p>
        </Link>
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
          <span>{post.commentCount}</span>
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