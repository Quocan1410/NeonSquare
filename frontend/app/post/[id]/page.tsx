'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  MessageCircle, 
  Share, 
  Bookmark, 
  Flag, 
  MoreHorizontal,
  Send,
  ThumbsUp,
  Reply
} from 'lucide-react';
import Link from 'next/link';

// Mock data for the post
const post = {
  id: '1',
  user: {
    fullName: 'Jane Smith',
    username: '@janesmith',
    profilePic: '/avatars/01.png',
    isOnline: true,
    verified: true
  },
  time: '2 hours ago',
  content: 'Math exam today was so hard! Does anyone have study tips? I\'m really struggling with calculus and need some advice on how to prepare better for the next exam. Any resources or study methods that worked for you?',
  likes: 12,
  comments: 5,
  shares: 3,
  bookmarks: 8,
  tags: ['#mathematics', '#calculus', '#study', '#help'],
  isLiked: false,
  isBookmarked: false
};

// Mock data - would need backend API for comments
const comments = [
  {
    id: '1',
    user: {
      fullName: 'Mike Johnson',
      username: '@mikej',
      profilePic: '/avatars/02.png',
      isOnline: false
    },
    time: '1 hour ago',
    content: 'I found that practicing with Khan Academy really helped me with calculus. The step-by-step explanations are great!',
    likes: 8,
    replies: 2,
    isLiked: false
  },
  {
    id: '2',
    user: {
      fullName: 'Sarah Wilson',
      username: '@sarahw',
      profilePic: '/avatars/03.png',
      isOnline: true
    },
    time: '45 minutes ago',
    content: 'Try breaking down problems into smaller steps. Also, make sure you understand the fundamental concepts before moving to complex problems.',
    likes: 5,
    replies: 1,
    isLiked: true
  },
  {
    id: '3',
    user: {
      fullName: 'Alex Chen',
      username: '@alexc',
      profilePic: '/avatars/04.png',
      isOnline: false
    },
    time: '30 minutes ago',
    content: 'I have some practice problems that might help. DM me if you want them!',
    likes: 3,
    replies: 0,
    isLiked: false
  }
];

const replies = [
  {
    id: '1-1',
    user: {
      fullName: 'Jane Smith',
      username: '@janesmith',
      profilePic: '/avatars/01.png',
      isOnline: true
    },
    time: '30 minutes ago',
    content: 'Thanks Mike! I\'ll check out Khan Academy.',
    likes: 2,
    isLiked: false
  },
  {
    id: '1-2',
    user: {
      fullName: 'Tom Brown',
      username: '@tomb',
      profilePic: '/avatars/05.png',
      isOnline: false
    },
    time: '25 minutes ago',
    content: 'I second Khan Academy! Their calculus course is excellent.',
    likes: 1,
    isLiked: false
  }
];

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [bookmarkCount, setBookmarkCount] = useState(post.bookmarks);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    setBookmarkCount(isBookmarked ? bookmarkCount - 1 : bookmarkCount + 1);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen forum-layout">
      <div className="flex">
        {/* Sidebar */}
        <div className="forum-sidebar scrollbar-forum">
          <div className="flex flex-col h-full">
            <div className="p-6 space-y-6 flex-1">
              {/* Back Button */}
              <Link href="/dashboard" className="flex items-center text-forum-secondary hover:text-forum-primary transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>

              {/* Post Stats */}
              <div className="forum-card p-4">
                <h4 className="font-semibold text-forum-primary mb-3">Post Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-forum-secondary">Likes</span>
                    <span className="text-forum-primary font-semibold">{likeCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forum-secondary">Comments</span>
                    <span className="text-forum-primary font-semibold">{post.comments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forum-secondary">Shares</span>
                    <span className="text-forum-primary font-semibold">{post.shares}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forum-secondary">Bookmarks</span>
                    <span className="text-forum-primary font-semibold">{bookmarkCount}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="forum-card p-4">
                <h4 className="font-semibold text-forum-primary mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Related Posts */}
              <div className="forum-card p-4">
                <h4 className="font-semibold text-forum-primary mb-3">Related Posts</h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                    <p className="text-sm text-forum-primary line-clamp-2">Need help with integration by parts...</p>
                    <p className="text-xs text-forum-secondary mt-1">2 hours ago</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                    <p className="text-sm text-forum-primary line-clamp-2">Calculus study group forming...</p>
                    <p className="text-xs text-forum-secondary mt-1">4 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 forum-main">
          <div className="forum-content space-y-6">
            {/* Header */}
            <div className="glass-effect p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-forum-primary">Post Details</h1>
                  <p className="text-forum-secondary">View and interact with this post</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="btn-forum">
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </Button>
                  <Button variant="outline" className="btn-forum">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Post */}
            <div className="forum-card p-6">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="avatar-forum w-12 h-12">
                      <AvatarImage src={post.user.profilePic} alt={post.user.fullName} />
                      <AvatarFallback className="gradient-primary text-primary-foreground">
                        {post.user.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {post.user.isOnline && (
                      <div className="status-online"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-forum-primary">{post.user.fullName}</h3>
                      {post.user.verified && (
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-forum-secondary">{post.user.username} • {post.time}</p>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-6">
                <p className="text-forum-primary leading-relaxed text-lg">{post.content}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <Badge key={index} className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-6">
                  <Button
                    variant="ghost"
                    onClick={handleLike}
                    className={`flex items-center space-x-2 ${
                      isLiked ? 'text-blue-600' : 'text-forum-secondary hover:text-blue-600'
                    }`}
                  >
                    <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likeCount}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-forum-secondary hover:text-primary"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-forum-secondary hover:text-primary"
                  >
                    <Share className="w-5 h-5" />
                    <span>{post.shares}</span>
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  onClick={handleBookmark}
                  className={`flex items-center space-x-2 ${
                    isBookmarked ? 'text-primary' : 'text-forum-secondary hover:text-primary'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{bookmarkCount}</span>
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="forum-card p-6">
              <h3 className="text-lg font-semibold text-forum-primary mb-4">Comments ({post.comments})</h3>
              
              {/* Add Comment */}
              <div className="mb-6">
                <div className="flex space-x-3">
                  <Avatar className="avatar-forum w-8 h-8">
                    <AvatarImage src="/avatars/user.png" alt="You" />
                    <AvatarFallback className="gradient-primary text-primary-foreground text-sm">
                      Y
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="input-forum"
                    />
                  </div>
                  <Button onClick={handleComment} className="btn-primary">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-4">
                    {/* Comment */}
                    <div className="flex space-x-3">
                      <Avatar className="avatar-forum w-10 h-10">
                        <AvatarImage src={comment.user.profilePic} alt={comment.user.fullName} />
                        <AvatarFallback className="gradient-primary text-primary-foreground">
                          {comment.user.fullName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-forum-primary">{comment.user.fullName}</h4>
                            <span className="text-sm text-forum-secondary">{comment.user.username}</span>
                            <span className="text-sm text-forum-secondary">•</span>
                            <span className="text-sm text-forum-secondary">{comment.time}</span>
                          </div>
                          <p className="text-forum-primary mb-3">{comment.content}</p>
                          <div className="flex items-center space-x-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`flex items-center space-x-1 ${
                                comment.isLiked ? 'text-blue-600' : 'text-forum-secondary hover:text-blue-600'
                              }`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span>{comment.likes}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center space-x-1 text-forum-secondary hover:text-primary"
                            >
                              <Reply className="w-4 h-4" />
                              <span>Reply</span>
                            </Button>
                          </div>
                        </div>

                        {/* Replies */}
                        {comment.id === '1' && (
                          <div className="ml-8 mt-3 space-y-3">
                            {replies.map((reply) => (
                              <div key={reply.id} className="flex space-x-3">
                                <Avatar className="avatar-forum w-8 h-8">
                                  <AvatarImage src={reply.user.profilePic} alt={reply.user.fullName} />
                                  <AvatarFallback className="gradient-primary text-primary-foreground text-xs">
                                    {reply.user.fullName.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="bg-muted/30 rounded-lg p-3">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h5 className="font-medium text-forum-primary text-sm">{reply.user.fullName}</h5>
                                      <span className="text-xs text-forum-secondary">{reply.user.username}</span>
                                      <span className="text-xs text-forum-secondary">•</span>
                                      <span className="text-xs text-forum-secondary">{reply.time}</span>
                                    </div>
                                    <p className="text-forum-primary text-sm">{reply.content}</p>
                                    <div className="flex items-center space-x-3 mt-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`flex items-center space-x-1 ${
                                          reply.isLiked ? 'text-blue-600' : 'text-forum-secondary hover:text-blue-600'
                                        }`}
                                      >
                                        <ThumbsUp className="w-3 h-3" />
                                        <span className="text-xs">{reply.likes}</span>
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex items-center space-x-1 text-forum-secondary hover:text-primary text-xs"
                                      >
                                        <Reply className="w-3 h-3" />
                                        <span>Reply</span>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
