'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { OnlineIndicator } from '@/components/ui/online-indicator';
import { Search, Filter, TrendingUp, Users, BookOpen, MessageCircle, Heart, Share, Plus } from 'lucide-react';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const trendingTopics = [
    { name: 'Mathematics', posts: 245, trending: true },
    { name: 'Physics', posts: 189, trending: false },
    { name: 'Programming', posts: 156, trending: true },
    { name: 'Science', posts: 134, trending: false },
    { name: 'Literature', posts: 98, trending: false },
    { name: 'History', posts: 87, trending: false }
  ];

  const suggestedUsers = [
    {
      id: 1,
      name: 'Jane Smith',
      role: 'Grade 12 Student',
      avatar: '/avatar2.jpg',
      mutualFriends: 3,
      isOnline: true
    },
    {
      id: 2,
      name: 'Mike Johnson',
      role: 'Grade 12 Student',
      avatar: '/avatar3.jpg',
      mutualFriends: 1,
      isOnline: false
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      role: 'Grade 12 Student',
      avatar: '/avatar4.jpg',
      mutualFriends: 5,
      isOnline: true
    }
  ];

  const recentPosts = [
    {
      id: 1,
      author: 'Alex Chen',
      content: 'Just finished an amazing calculus problem! Anyone else struggling with derivatives?',
      likes: 12,
      comments: 8,
      time: '2 hours ago',
      topic: 'Mathematics'
    },
    {
      id: 2,
      author: 'Emma Davis',
      content: 'Sharing my study notes for the upcoming physics exam. Hope it helps!',
      likes: 25,
      comments: 15,
      time: '4 hours ago',
      topic: 'Physics'
    },
    {
      id: 3,
      author: 'David Brown',
      content: 'Built my first React app today! The learning curve is steep but rewarding.',
      likes: 18,
      comments: 12,
      time: '6 hours ago',
      topic: 'Programming'
    }
  ];

  return (
    <div className="min-h-screen forum-layout">
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 forum-main">
          {/* Header */}
          <div className="sticky top-0 z-10 glass-effect border-b border-border">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <Breadcrumb items={[{ label: 'Explore', current: true }]} />
                    <h1 className="text-2xl font-bold text-forum-primary mt-1">Explore</h1>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forum-secondary w-4 h-4" />
                    <Input
                      placeholder="Search posts, topics, or people..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-80 input-forum"
                      aria-label="Search posts and people"
                      role="searchbox"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button variant="outline" className="btn-forum">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="forum-content space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trending Topics */}
            <Card className="forum-card">
              <CardHeader>
                <CardTitle className="flex items-center text-forum-primary">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors premium-hover">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-forum-primary">{topic.name}</p>
                          <p className="text-sm text-forum-secondary">{topic.posts} posts</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {topic.trending && (
                          <Badge className="badge-forum accent">Trending</Badge>
                        )}
                        <Button size="sm" className="btn-forum">
                          Follow
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card className="forum-card">
              <CardHeader>
                <CardTitle className="text-forum-primary">Recent Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors premium-hover">
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar className="avatar-forum w-10 h-10">
                            <AvatarFallback className="gradient-primary text-primary-foreground">
                              {post.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1">
                            <OnlineIndicator size="sm" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="font-semibold text-forum-primary">{post.author}</p>
                            <Badge className="badge-forum text-xs">{post.topic}</Badge>
                            <span className="text-xs text-forum-secondary">•</span>
                            <span className="text-xs text-forum-secondary">{post.time}</span>
                          </div>
                          <p className="text-forum-primary mb-3">{post.content}</p>
                          <div className="flex items-center space-x-4 text-sm text-forum-secondary">
                            <button className="btn-forum hover-glow">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {post.comments}
                            </button>
                            <button className="btn-forum hover-glow">
                              <Heart className="w-4 h-4 mr-1" />
                              {post.likes}
                            </button>
                            <button className="btn-forum hover-glow">
                              <Share className="w-4 h-4 mr-1" />
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Users */}
            <Card className="forum-card">
              <CardHeader>
                <CardTitle className="flex items-center text-forum-primary">
                  <Users className="w-5 h-5 mr-2" />
                  Suggested Friends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestedUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 premium-hover p-2 rounded-lg">
                      <div className="relative">
                        <Avatar className="avatar-forum w-10 h-10">
                          <AvatarFallback className="gradient-primary text-primary-foreground">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1">
                          <OnlineIndicator size="sm" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-forum-primary text-sm">{user.name}</p>
                        <p className="text-xs text-forum-secondary">{user.role}</p>
                        <p className="text-xs text-forum-secondary">{user.mutualFriends} mutual friends</p>
                      </div>
                      <Button size="sm" className="btn-forum">
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
          </div>
        </main>
      </div>
    </div>
  );
}
