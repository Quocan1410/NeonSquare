'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Loader2, Send, MessageCircle, MoreHorizontal, Heart } from 'lucide-react';
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
              </div>
              <p className="text-slate-800 dark:text-slate-200">{post.text}</p>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">Loading comments...</p>
              </div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No comments yet</h3>
              <p className="text-slate-500 dark:text-slate-400">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment, index) => (
                <div key={comment.id} className="group">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Avatar className="w-10 h-10 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-400 transition-all duration-200">
                        <AvatarImage 
                          src={comment.author?.profilePicUrl} 
                          alt={comment.author?.firstName}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                          {comment.author ? `${comment.author.firstName.charAt(0)}${comment.author.lastName.charAt(0)}` : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {index < comments.length - 1 && (
                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-slate-200 dark:bg-slate-700"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 group-hover:bg-slate-100 dark:group-hover:bg-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                            {comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : 'Unknown User'}
                          </h4>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full">
                            <MoreHorizontal className="w-4 h-4 text-slate-500" />
                          </button>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed mb-3">
                          {comment.content}
                        </p>
                        <div className="flex items-center space-x-6">
                          <button className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors duration-200 group/btn">
                            <Heart className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                            <span className="text-xs font-medium">Like</span>
                          </button>
                          <button className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors duration-200 group/btn">
                            <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                            <span className="text-xs font-medium">Reply</span>
                          </button>
                          <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                            <span className="text-xs">0 likes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment Input */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-start space-x-4">
            <Avatar className="w-10 h-10 ring-2 ring-slate-200 dark:ring-slate-700">
              <AvatarImage 
                src={user?.profilePicUrl} 
                alt={user?.firstName}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 relative">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-600 shadow-sm focus-within:shadow-md focus-within:border-blue-400 dark:focus-within:border-blue-500 transition-all duration-200">
                <textarea
                  placeholder="Write a comment..."
                  className="w-full p-4 rounded-2xl bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none min-h-[50px] max-h-32 text-sm focus:outline-none"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={1}
                />
                {commentContent.trim() && (
                  <div className="flex items-center justify-between p-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{commentContent.length}/500</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCommentContent('')}
                        className="px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitComment}
                        disabled={isSubmitting}
                        className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Posting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3" />
                            <span>Post</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
