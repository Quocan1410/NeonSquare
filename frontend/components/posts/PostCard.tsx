// NeonSquare/frontend/components/posts/PostCard.tsx
'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { OnlineIndicator } from '@/components/ui/online-indicator';
import { ImageGallery } from '@/components/ui/image-gallery';
import { Heart, MessageCircle, MoreHorizontal, Eye } from 'lucide-react';
import Link from 'next/link';
import { Post } from '@/lib/api';
import { CommentModal } from './CommentModal';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.reactionCount || 0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  // Add null checks
  if (!post || !post.author) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 animate-pulse">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleImageClick = (index: number) => {
    setGalleryIndex(index);
    setIsGalleryOpen(true);
  };

  const handleCommentClick = () => {
    setIsCommentModalOpen(true);
  };


  return (
    <article 
      className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative group/avatar">
              <Avatar className="w-12 h-12 ring-2 ring-slate-200 dark:ring-slate-700 group-hover/avatar:ring-blue-400 transition-all duration-300">
                <AvatarImage 
                  src={post.author.profilePicUrl} 
                  alt={`${post.author.firstName || ''} ${post.author.lastName || ''}`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                  {(post.author.firstName || '').charAt(0)}{(post.author.lastName || '').charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                <OnlineIndicator size="sm" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {post.author.firstName || ''} {post.author.lastName || ''}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{post.visibility?.toLowerCase() || 'public'}</span>
                </div>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-2"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 pb-4">
        <Link href={`/post/${post.id}`} className="block group/link">
          <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-base group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors duration-200">
            {post.text || 'No content'}
          </p>
        </Link>
      </div>

      {/* Post Images */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="px-6 pb-4">
          {post.imageUrls.length === 1 ? (
            <div className="relative group/image overflow-hidden rounded-xl">
              <img 
                src={post.imageUrls[0]} 
                alt="Post image" 
                className="w-full max-h-96 object-cover transition-transform duration-300 group-hover/image:scale-105 cursor-pointer"
                onClick={() => handleImageClick(0)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors duration-300"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {post.imageUrls.slice(0, 4).map((imageUrl, index) => (
                <div key={index} className="relative group/image overflow-hidden rounded-xl">
                  <img 
                    src={imageUrl} 
                    alt={`Post image ${index + 1}`} 
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover/image:scale-105 cursor-pointer"
                    onClick={() => handleImageClick(index)}
                  />
                  {index === 3 && post.imageUrls && post.imageUrls.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover/image:bg-black/70 transition-colors duration-300">
                      <span className="text-white font-bold text-lg">+{post.imageUrls.length - 4}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors duration-300"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                isLiked 
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
            >
              <Heart className={`w-5 h-5 transition-transform duration-200 ${isLiked ? 'fill-current scale-110' : 'hover:scale-110'}`} />
              <span className="font-medium">{likeCount || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCommentClick}
              className="flex items-center space-x-2 px-4 py-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5 hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">{post.commentCount || 0}</span>
            </Button>
          </div>
          
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {post.commentCount || 0} comments • {likeCount || 0} likes
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <ImageGallery
        images={post.imageUrls || []}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={galleryIndex}
      />

      {/* Comment Modal */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        post={post}
      />
    </article>
  );
}