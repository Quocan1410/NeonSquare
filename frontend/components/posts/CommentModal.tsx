// NeonSquare/frontend/components/posts/CommentModal.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Send,
  MessageCircle,
  MoreHorizontal,
  ThumbsUp,
} from "lucide-react";
import { Comment, Post } from "@/lib/api";
import { apiService } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

export function CommentModal({ isOpen, onClose, post }: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  );
  const { user } = useAuth();

  // Generate consistent avatar colors based on user ID
  const getAvatarColors = (userId: string) => {
    const colors = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-blue-600",
      "from-pink-500 to-red-600",
      "from-yellow-500 to-orange-600",
      "from-indigo-500 to-purple-600",
      "from-teal-500 to-green-600",
      "from-rose-500 to-pink-600",
      "from-cyan-500 to-blue-600",
    ];

    // Simple hash function to get consistent color for same user
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const fetchComments = async () => {
    if (!post.id) {
      console.log("No post ID for fetching comments");
      return;
    }

    console.log("Fetching comments for post:", post.id);
    setIsLoading(true);
    try {
      const fetchedComments = await apiService.getComments(post.id);
      console.log("Fetched comments:", fetchedComments);

      // Fetch user data and replies for each comment
      const commentsWithAuthors = await Promise.all(
        fetchedComments.map(async (comment) => {
          const [user, replies] = await Promise.all([
            apiService.getUser(comment.userId),
            apiService.getReplies(comment.id),
          ]);

          // Fetch user data for replies
          const repliesWithAuthors = await Promise.all(
            replies.map(async (reply) => {
              const replyUser = await apiService.getUser(reply.userId);
              return { ...reply, author: replyUser };
            })
          );

          return {
            ...comment,
            author: user,
            replies: repliesWithAuthors,
          };
        })
      );

      setComments(commentsWithAuthors);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
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
      console.log("Missing required data:", {
        commentContent,
        user,
        postId: post.id,
      });
      return;
    }

    console.log("Submitting comment:", {
      postId: post.id,
      content: commentContent,
      userId: user.id,
    });
    setIsSubmitting(true);
    try {
      const result = await apiService.createComment(
        post.id,
        commentContent,
        user.id
      );
      console.log("Comment created successfully:", result);
      setCommentContent("");
      fetchComments();
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
    setReplyContent("");
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !user || !replyingTo) {
      console.log("Missing required data for reply:", {
        replyContent,
        user,
        replyingTo,
      });
      return;
    }

    console.log("Submitting reply:", {
      commentId: replyingTo.id,
      content: replyContent,
      userId: user.id,
    });
    setIsSubmittingReply(true);
    try {
      const result = await apiService.createReply(
        replyingTo.id,
        replyContent,
        user.id
      );
      console.log("Reply created successfully:", result);
      setReplyContent("");
      setReplyingTo(null);
      fetchComments(); // Refresh comments to show new reply
    } catch (error) {
      console.error("Failed to create reply:", error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleKeyPressReply = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitReply();
    }
  };

  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        {/* A11y: Radix requires a DialogTitle as a descendant of DialogContent */}
        <DialogTitle className="sr-only">Comments</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Comments
          </h2>
        </div>

        {/* Post Content */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={post.author?.profilePicUrl}
                alt={post.author?.firstName}
              />
              <AvatarFallback
                className={`bg-gradient-to-br ${getAvatarColors(
                  post.author?.id || "default"
                )} text-white`}
              >
                {post.author
                  ? `${post.author.firstName.charAt(
                      0
                    )}${post.author.lastName.charAt(0)}`
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {post.author
                    ? `${post.author.firstName} ${post.author.lastName}`
                    : "Unknown User"}
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
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Loading comments...
                </p>
              </div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No comments yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment, index) => (
                <div key={comment.id} className="group">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-10 h-10 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-400 transition-all duration-200">
                      <AvatarImage
                        src={comment.author?.profilePicUrl}
                        alt={comment.author?.firstName}
                        className="object-cover"
                      />
                      <AvatarFallback
                        className={`bg-gradient-to-br ${getAvatarColors(
                          comment.author?.id || "default"
                        )} text-white font-semibold`}
                      >
                        {comment.author
                          ? `${comment.author.firstName.charAt(
                              0
                            )}${comment.author.lastName.charAt(0)}`
                          : "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 group-hover:bg-slate-100 dark:group-hover:bg-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                              {comment.author
                                ? `${comment.author.firstName} ${comment.author.lastName}`
                                : "Unknown User"}
                            </h4>
                            {comment.author?.id === post.author?.id && (
                              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full font-medium">
                                Author
                              </span>
                            )}
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full">
                            <MoreHorizontal className="w-4 h-4 text-slate-500" />
                          </button>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed mb-3">
                          {comment.content}
                        </p>
                        <div className="flex items-center space-x-6">
                          <button className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors duration-200 group/btn">
                            <ThumbsUp className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                            <span className="text-xs font-medium">Like</span>
                          </button>
                          <button
                            onClick={() => handleReply(comment)}
                            className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors duration-200 group/btn"
                          >
                            <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                            <span className="text-xs font-medium">Reply</span>
                          </button>
                          <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                            <span className="text-xs">0 likes</span>
                          </div>
                        </div>
                      </div>

                      {/* Replies Section */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 ml-12 relative">
                          {/* Connection Line */}
                          <div className="absolute -left-6 top-0 w-0.5 h-6 bg-slate-300 dark:bg-slate-600"></div>

                          <button
                            onClick={() => toggleReplies(comment.id)}
                            className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 text-sm font-medium mb-3 transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>
                              {expandedReplies.has(comment.id)
                                ? "Hide"
                                : "View"}{" "}
                              {comment.replies.length}{" "}
                              {comment.replies.length === 1
                                ? "reply"
                                : "replies"}
                            </span>
                          </button>

                          {expandedReplies.has(comment.id) && (
                            <div className="space-y-3">
                              {comment.replies.map((reply, replyIndex) => (
                                <div key={reply.id} className="relative">
                                  {/* Reply Connection Line */}
                                  {comment.replies &&
                                    replyIndex < comment.replies.length - 1 && (
                                      <div className="absolute -left-6 top-8 w-0.5 h-8 bg-slate-300 dark:bg-slate-600"></div>
                                    )}

                                  <div className="flex items-start space-x-3">
                                    <Avatar className="w-8 h-8 ring-2 ring-slate-200 dark:ring-slate-700">
                                      <AvatarImage
                                        src={reply.author?.profilePicUrl}
                                        alt={reply.author?.firstName}
                                        className="object-cover"
                                      />
                                      <AvatarFallback
                                        className={`bg-gradient-to-br ${getAvatarColors(
                                          reply.author?.id || "default"
                                        )} text-white font-semibold text-xs`}
                                      >
                                        {reply.author
                                          ? `${reply.author.firstName.charAt(
                                              0
                                            )}${reply.author.lastName.charAt(
                                              0
                                            )}`
                                          : "U"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <div className="bg-slate-100 dark:bg-slate-700/50 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center justify-between mb-1">
                                          <div className="flex items-center space-x-2">
                                            <h5 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                                              {reply.author
                                                ? `${reply.author.firstName} ${reply.author.lastName}`
                                                : "Unknown User"}
                                            </h5>
                                            {reply.author?.id ===
                                              post.author?.id && (
                                              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full font-medium">
                                                Author
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed mb-2">
                                          {reply.content}
                                        </p>
                                        <div className="flex items-center space-x-4">
                                          <button className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors duration-200 group/btn">
                                            <ThumbsUp className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                                            <span className="text-xs font-medium">
                                              Like
                                            </span>
                                          </button>
                                          <button
                                            onClick={() => handleReply(reply)}
                                            className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors duration-200 group/btn"
                                          >
                                            <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                                            <span className="text-xs font-medium">
                                              Reply
                                            </span>
                                          </button>
                                          <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                                            <span className="text-xs">
                                              0 likes
                                            </span>
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
                      )}

                      {/* Reply Input */}
                      {replyingTo && replyingTo.id === comment.id && (
                        <div className="mt-3 ml-12 relative">
                          {/* Connection Line to Reply Input */}
                          <div className="absolute -left-6 top-0 w-0.5 h-6 bg-slate-300 dark:bg-slate-600"></div>

                          <div className="flex items-start space-x-3">
                            <Avatar className="w-8 h-8 ring-2 ring-slate-200 dark:ring-slate-700">
                              <AvatarImage
                                src={user?.profilePicUrl}
                                alt={user?.firstName}
                                className="object-cover"
                              />
                              <AvatarFallback
                                className={`bg-gradient-to-br ${getAvatarColors(
                                  user?.id || "default"
                                )} text-white font-semibold text-xs`}
                              >
                                {user
                                  ? `${user.firstName.charAt(
                                      0
                                    )}${user.lastName.charAt(0)}`
                                  : "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 relative">
                              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-600 shadow-sm focus-within:shadow-md focus-within:border-blue-400 dark:focus-within:border-blue-500 transition-all duration-200">
                                <textarea
                                  placeholder={`Reply to ${
                                    comment.author?.firstName || "Unknown User"
                                  }...`}
                                  className="w-full p-3 rounded-2xl bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none min-h-[40px] max-h-24 text-sm focus:outline-none"
                                  value={replyContent}
                                  onChange={(e) =>
                                    setReplyContent(e.target.value)
                                  }
                                  onKeyPress={handleKeyPressReply}
                                  rows={1}
                                />
                                {replyContent.trim() && (
                                  <div className="flex items-center justify-between p-3 border-t border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                                      <span>{replyContent.length}/500</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={handleCancelReply}
                                        className="px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={handleSubmitReply}
                                        disabled={isSubmittingReply}
                                        className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                                      >
                                        {isSubmittingReply ? (
                                          <>
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            <span>Posting...</span>
                                          </>
                                        ) : (
                                          <>
                                            <Send className="w-3 h-3" />
                                            <span>Reply</span>
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
                      )}
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
              <AvatarFallback
                className={`bg-gradient-to-br ${getAvatarColors(
                  user?.id || "default"
                )} text-white font-semibold`}
              >
                {user
                  ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                  : "U"}
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
                        onClick={() => setCommentContent("")}
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
