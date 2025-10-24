'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter, TrendingUp, Users, BookOpen, MessageCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Search Header */}
        <div className="card-social p-6">
          <h1 className="text-3xl font-bold text-foreground mb-4">Explore</h1>
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search posts, topics, or people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-social pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trending Topics */}
            <Card className="card-social">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{topic.name}</p>
                          <p className="text-sm text-muted-foreground">{topic.posts} posts</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {topic.trending && (
                          <Badge className="badge-social accent">Trending</Badge>
                        )}
                        <Button size="sm" variant="outline">
                          Follow
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card className="card-social">
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="font-semibold text-foreground">{post.author}</p>
                            <Badge className="badge-social text-xs">{post.topic}</Badge>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{post.time}</span>
                          </div>
                          <p className="text-foreground mb-3">{post.content}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <button className="btn-social">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {post.comments}
                            </button>
                            <button className="btn-social">
                              <Users className="w-4 h-4 mr-1" />
                              {post.likes}
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
            <Card className="card-social">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Suggested Friends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestedUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {user.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                        <p className="text-xs text-muted-foreground">{user.mutualFriends} mutual friends</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-social">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="btn-primary w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Create Study Group
                </Button>
                <Button className="btn-secondary w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Discussion
                </Button>
                <Button className="btn-secondary w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Find Study Partners
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
