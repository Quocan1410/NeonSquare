'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Loader2, Send } from 'lucide-react';
import { Comment, Post } from '@/lib/api';
import { apiService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

export function CommentModal({ isOpen, onClose, post }: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchComments = async () => {
    if (!post.id) {
      console.log('No post ID for fetching comments');
      return;
    }
    
    console.log('Fetching comments for post:', post.id);
    setIsLoading(true);
    try {
      const fetchedComments = await apiService.getComments(post.id);
      console.log('Fetched comments:', fetchedComments);
      
      // Fetch user data for each comment
      const commentsWithAuthors = await Promise.all(
        fetchedComments.map(async (comment) => {
          try {
            const user = await apiService.getUser(comment.userId);
            return { ...comment, author: user };
          } catch (error) {
            console.error('Failed to fetch user for comment:', comment.userId, error);
            return comment;
          }
        })
      );
      
      setComments(commentsWithAuthors);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && post.id) {
      fetchComments();
    }
  }, [isOpen, post.id]);

  const handleSubmitComment = async () => {
    if (!commentContent.trim() || !user || !post.id) {
      console.log('Missing required data:', { commentContent, user, postId: post.id });
      return;
    }

    console.log('Submitting comment:', { postId: post.id, content: commentContent, userId: user.id });
    setIsSubmitting(true);
    try {
      const result = await apiService.createComment(post.id, commentContent, user.id);
      console.log('Comment created successfully:', result);
      setCommentContent('');
      fetchComments();
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Comments
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Post Content */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.author?.profilePicUrl} alt={post.author?.firstName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {post.author ? `${post.author.firstName.charAt(0)}${post.author.lastName.charAt(0)}` : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown User'}
                </h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {formatTimeAgo(post.updateAt || '')}
                </span>
              </div>
              <p className="text-slate-800 dark:text-slate-200">{post.text}</p>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.author?.profilePicUrl} alt={comment.author?.firstName} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                    {comment.author ? `${comment.author.firstName.charAt(0)}${comment.author.lastName.charAt(0)}` : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-3 max-w-md">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : 'Unknown User'}
                      </span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{formatTimeAgo(comment.createdAt)}</span>
                    <button className="hover:text-blue-500 transition-colors">Like</button>
                    <button className="hover:text-blue-500 transition-colors">Reply</button>
                    <div className="flex items-center space-x-1">
                      <span>0</span>
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">👍</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-start space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profilePicUrl} alt={user?.firstName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 relative">
              <textarea
                placeholder="Write a comment..."
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none min-h-[40px] max-h-32 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
              />
              {commentContent.trim() && (
                <button
                  onClick={handleSubmitComment}
                  disabled={isSubmitting}
                  className="absolute bottom-2 right-3 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
