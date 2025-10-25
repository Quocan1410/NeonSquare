// NeonSquare/frontend/components/posts/PostCard.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { OnlineIndicator } from '@/components/ui/online-indicator';
import { ImageGallery } from '@/components/ui/image-gallery';
import { MessageCircle, MoreHorizontal, Eye, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { Post, apiService, Reaction, ReactionType } from '@/lib/api';
import { CommentModal } from './CommentModal';
import { useAuth } from '@/contexts/AuthContext';

interface PostCardProps {
  post: Post;
}

const reactionIcons: Record<ReactionType, typeof ThumbsUp> = { LIKE: ThumbsUp };
const reactionColors: Record<ReactionType, string> = { LIKE: 'text-blue-500' };

export function PostCard({ post }: PostCardProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>(
    Array.isArray(post.reactions) ? normalizeReactions(post.reactions) : []
  );
  const [isToggling, setIsToggling] = useState(false);
  const { user: authUser } = useAuth();
  const rollbackRef = useRef<Reaction[] | null>(null);

  const currentUserId = authUser?.id ?? '';
  const currentReaction: ReactionType | null =
    Array.isArray(reactions) && currentUserId
      ? reactions.find((r) => (r.userId || (r as any).user?.id) === currentUserId)?.type ?? null
      : null;

  useEffect(() => {
    const loadReactions = async () => {
      try {
        const postReactions = await apiService.getPostReactions(post.id);
        setReactions(postReactions);
      } catch (error) {
        console.error('Error loading reactions:', error);
        setReactions(Array.isArray(post.reactions) ? normalizeReactions(post.reactions) : []);
      }
    };
    loadReactions();
  }, [post.id, post.reactions]);

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
    if (!currentUserId || isToggling) return;
    setIsToggling(true);

    // Keep a rollback snapshot
    rollbackRef.current = reactions;

    try {
      if (reaction === 'LIKE') {
        // Optimistically add like
        const optimistic: Reaction = {
          id: `temp-${currentUserId}`,
          type: 'LIKE',
          userId: currentUserId,
          user: { id: currentUserId } as any,
          createdAt: new Date().toISOString(),
        };
        setReactions((prev) => {
          const base = Array.isArray(prev) ? prev : [];
          const filtered = base.filter((r) => (r.userId || (r as any).user?.id) !== currentUserId);
          return [...filtered, optimistic];
        });

        // Send request, then replace optimistic with server reaction
        const real = await apiService.addReaction(post.id, 'LIKE', currentUserId);
        setReactions((prev) => {
          const base = Array.isArray(prev) ? prev : [];
          // remove optimistic
          const noTemp = base.filter((r) => r.id !== `temp-${currentUserId}`);
          // remove any dup by user
          const filtered = noTemp.filter((r) => (r.userId || (r as any).user?.id) !== currentUserId);
          return [...filtered, real];
        });
      } else {
        // Optimistically remove like
        setReactions((prev) =>
          (Array.isArray(prev) ? prev : []).filter(
            (r) => (r.userId || (r as any).user?.id) !== currentUserId
          )
        );
        await apiService.removeReaction(post.id, currentUserId);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      // Roll back on error
      if (rollbackRef.current) setReactions(rollbackRef.current);
    } finally {
      setIsToggling(false);
    }
  };

  const handleImageClick = (index: number) => {
    setGalleryIndex(index);
    setIsGalleryOpen(true);
  };

  const handleCommentClick = () => setIsCommentModalOpen(true);

  const authorFirst = post.author.firstName || '';
  const authorLast = post.author.lastName || '';
  const authorInitials = `${authorFirst.charAt(0)}${authorLast.charAt(0)}` || 'U';

  return (
    <article className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative group/avatar">
              <Avatar className="w-12 h-12 ring-2 ring-slate-200 dark:ring-slate-700 group-hover/avatar:ring-blue-400 transition-all duration-300">
                <AvatarImage
                  src={post.author.profilePicUrl}
                  alt={`${authorFirst} ${authorLast}`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                <OnlineIndicator size="sm" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {authorFirst} {authorLast}
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

      {/* Content */}
      <div className="px-6 pb-4">
        <Link href={`/post/${post.id}`} className="block group/link">
          <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-base group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors duration-200">
            {post.text || 'No content'}
          </p>
        </Link>
      </div>

      {/* Images */}
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

      {/* Likes summary */}
      {Array.isArray(reactions) && reactions.length > 0 && (
        <div className="px-6 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30">
          <div className="flex items-center space-x-2">
            <div className="flex items-center -space-x-1">
              {reactions.slice(0, 3).map((reaction, index) => {
                const Icon = reactionIcons[reaction.type];
                const color = reactionColors[reaction.type];
                return (
                  <div
                    key={reaction.id || `${reaction.type}-${index}`}
                    className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${color} bg-white shadow-sm ${index > 0 ? '-ml-1' : ''}`}
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

      {/* Actions */}
      <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* Like */}
            <button
              onClick={() => handleReactionChange(currentReaction === 'LIKE' ? null : 'LIKE')}
              disabled={isToggling}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 flex-1 justify-center
                ${currentReaction === 'LIKE'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
            >
              <ThumbsUp className={`w-5 h-5 ${currentReaction === 'LIKE' ? 'fill-current' : ''}`} />
              <span className="font-medium">
                {currentReaction === 'LIKE' ? 'Liked' : 'Like'}
              </span>
            </button>

            {/* Comment */}
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

      {/* Image Gallery */}
      <ImageGallery
        images={post.imageUrls || []}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={galleryIndex}
      />

      {/* Comments */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        post={post}
      />
    </article>
  );
}

function normalizeReactions(list: any[]): Reaction[] {
  return (Array.isArray(list) ? list : [])
    .map((r: any) => {
      const userId: string | undefined = r?.userId ?? r?.user?.id;
      if (!userId) return null;
      return {
        id: String(r?.id ?? `${userId}-${r?.type ?? 'LIKE'}`),
        type: (r?.type ?? 'LIKE') as ReactionType,
        userId,
        user: r?.user ? r.user : { id: userId },
        createdAt: r?.createdAt ?? new Date().toISOString(),
      } as Reaction;
    })
    .filter(Boolean) as Reaction[];
}
