// NeonSquare/frontend/components/posts/PostCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { OnlineIndicator } from '@/components/ui/online-indicator';
import { ImageGallery } from '@/components/ui/image-gallery';
import { Heart, MessageCircle, MoreHorizontal, Eye, ThumbsUp, Laugh, Zap, Frown, Angry } from 'lucide-react';
import Link from 'next/link';
import { Post, apiService } from '@/lib/api';
import { CommentModal } from './CommentModal';
import { ReactionType } from '@/lib/api';

interface PostCardProps {
  post: Post;
}

// Reaction icons and colors mapping
const reactionIcons = {
  LIKE: ThumbsUp,
  LOVE: Heart,
  WOW: Zap,
  SAD: Frown,
  ANGRY: Angry,
};

const reactionColors = {
  LIKE: 'text-blue-500',
  LOVE: 'text-red-500',
  WOW: 'text-purple-500',
  SAD: 'text-gray-500',
  ANGRY: 'text-orange-500',
};

export function PostCard({ post }: PostCardProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [reactions, setReactions] = useState(post.reactions || []);
  
  // Mock current user ID - in real app, get from auth context
  const currentUserId = 'current-user-id';
  
  // Find current user's reaction
  const currentReaction = reactions.find(r => r.user.id === currentUserId)?.type || null;
  
  // Load reactions from backend when component mounts
  useEffect(() => {
    const loadReactions = async () => {
      try {
        const postReactions = await apiService.getPostReactions(post.id);
        setReactions(postReactions);
      } catch (error) {
        console.error('Error loading reactions:', error);
        // Fallback to post.reactions if API fails
        setReactions(post.reactions || []);
      }
    };
    
    loadReactions();
  }, [post.id, post.reactions]);

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


  const handleReactionChange = async (reaction: ReactionType | null) => {
    try {
      if (reaction) {
        // Check if user already has this reaction
        const existingReaction = reactions.find(r => r.user.id === currentUserId && r.type === reaction);
        
        if (existingReaction) {
          // If same reaction, remove it (unclick)
          await apiService.removeReaction(post.id, currentUserId);
          setReactions(prev => prev.filter(r => r.id !== existingReaction.id));
        } else {
          // Remove any existing reaction from current user first
          const filteredReactions = reactions.filter(r => r.user.id !== currentUserId);
          
          // Add new reaction via API
          const newReaction = await apiService.addReaction(post.id, reaction, currentUserId);
          
          // Add new reaction to local state
          setReactions([...filteredReactions, newReaction]);
        }
      } else {
        // Remove current user's reaction
        await apiService.removeReaction(post.id, currentUserId);
        setReactions(prev => prev.filter(r => r.user.id !== currentUserId));
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      // Fallback to local state update
      if (reaction) {
        const existingReaction = reactions.find(r => r.user.id === currentUserId && r.type === reaction);
        if (existingReaction) {
          setReactions(prev => prev.filter(r => r.id !== existingReaction.id));
        } else {
          const filteredReactions = reactions.filter(r => r.user.id !== currentUserId);
          const newReaction = {
            id: Date.now().toString(),
            type: reaction,
            user: {
              id: currentUserId,
              firstName: 'You',
              lastName: '',
              email: 'you@example.com',
              isOnline: true,
              lastSeen: 'Online now'
            },
            createdAt: new Date().toISOString()
          };
          setReactions([...filteredReactions, newReaction]);
        }
      } else {
        setReactions(prev => prev.filter(r => r.user.id !== currentUserId));
      }
    }
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

      {/* Likes Count */}
      {reactions.length > 0 && (
        <div className="px-6 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30">
          <div className="flex items-center space-x-2">
            <div className="flex items-center -space-x-1">
              {reactions.slice(0, 3).map((reaction, index) => {
                const Icon = reactionIcons[reaction.type];
                const color = reactionColors[reaction.type];
                
                return (
                  <div
                    key={reaction.id}
                    className={`
                      w-6 h-6 rounded-full border-2 border-white flex items-center justify-center
                      ${color} bg-white shadow-sm
                      ${index > 0 ? '-ml-1' : ''}
                    `}
                    style={{ zIndex: 3 - index }}
                  >
                    <Icon className="w-3 h-3" />
                  </div>
                );
              })}
              {reactions.length > 3 && (
                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 text-gray-600 text-xs font-medium flex items-center justify-center -ml-1">
                  +{reactions.length - 3}
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {reactions.length} {reactions.length === 1 ? 'like' : 'likes'}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* Like Button */}
            <button
              onClick={() => handleReactionChange(currentReaction === 'LIKE' ? null : 'LIKE')}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 flex-1 justify-center
                ${currentReaction === 'LIKE' 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <ThumbsUp className={`w-5 h-5 ${currentReaction === 'LIKE' ? 'fill-current' : ''}`} />
              <span className="font-medium">
                {currentReaction === 'LIKE' ? 'Liked' : 'Like'}
              </span>
            </button>
            
            {/* Comment Button */}
            <button
              onClick={handleCommentClick}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex-1 justify-center"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Comment</span>
            </button>
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