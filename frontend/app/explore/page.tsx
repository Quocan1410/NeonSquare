'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { apiService } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { OnlineIndicator } from '@/components/ui/online-indicator';
import { useTheme } from '@/contexts/ThemeContext';
import { addToast } from '@/components/ui/toast';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  BookOpen, 
  MessageCircle, 
  Heart, 
  Share, 
  Plus,
  Star,
  Clock,
  Eye,
  ThumbsUp,
  MoreHorizontal,
  Hash,
  Sparkles,
  Zap,
  Target,
  Globe
} from 'lucide-react';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { themeColors } = useTheme();

  // Fetch suggested users from API
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        setIsLoading(true);
        // Add delay to ensure BE is ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        const users = await apiService.searchUsers('');
        setSuggestedUsers(users.slice(0, 3)); // Take first 3 users as suggestions
      } catch (error) {
        console.error('Failed to fetch suggested users:', error);
        // Fallback to empty array if API fails
        setSuggestedUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  // Mock data for trending topics (this would need a backend endpoint)
  const trendingTopics = [
    { name: 'Mathematics', posts: 245, trending: true, growth: '+12%', color: 'bg-blue-100 text-blue-700' },
    { name: 'Physics', posts: 189, trending: false, growth: '+8%', color: 'bg-purple-100 text-purple-700' },
    { name: 'Programming', posts: 156, trending: true, growth: '+25%', color: 'bg-green-100 text-green-700' },
    { name: 'Science', posts: 134, trending: false, growth: '+5%', color: 'bg-orange-100 text-orange-700' },
    { name: 'Literature', posts: 98, trending: false, growth: '+3%', color: 'bg-pink-100 text-pink-700' },
    { name: 'History', posts: 87, trending: false, growth: '+1%', color: 'bg-indigo-100 text-indigo-700' }
  ];

  const recentPosts = [
    {
      id: 1,
      author: 'Alex Chen',
      content: 'Just finished an amazing calculus problem! Anyone else struggling with derivatives? The key is understanding the chain rule and product rule. Here\'s my approach...',
      likes: 12,
      comments: 8,
      time: '2 hours ago',
      topic: 'Mathematics',
      views: 156,
      verified: true,
      trending: true
    },
    {
      id: 2,
      author: 'Emma Davis',
      content: 'Sharing my study notes for the upcoming physics exam. Hope it helps! I\'ve included diagrams and practice problems for each chapter.',
      likes: 25,
      comments: 15,
      time: '4 hours ago',
      topic: 'Physics',
      views: 234,
      verified: false,
      trending: false
    },
    {
      id: 3,
      author: 'David Brown',
      content: 'Built my first React app today! The learning curve is steep but rewarding. Here\'s what I learned about hooks and state management...',
      likes: 18,
      comments: 12,
      time: '6 hours ago',
      topic: 'Programming',
      views: 189,
      verified: true,
      trending: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Modern Header */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div>
                    <Breadcrumb items={[{ label: 'Home', href: '/dashboard' }, { label: 'Explore', current: true }]} />
                    <h1 className="text-3xl font-bold text-gray-900 mt-1 flex items-center">
                      <Sparkles className="w-8 h-8 text-primary mr-3" />
                      Explore
                    </h1>
                    <p className="text-gray-600 mt-1">Discover trending topics and connect with fellow students</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search posts, topics, or people..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 py-3 w-96 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                      style={{
                        borderColor: 'var(--primary-200)'
                      } as React.CSSProperties}
                      aria-label="Search posts and people"
                      role="searchbox"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="px-6 py-3 rounded-xl border-gray-200 hover:theme-border-primary hover:theme-bg-primary hover:text-white transition-all duration-500"
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Discovery Hero Section */}
                <div 
                  className={`bg-gradient-to-br ${themeColors.gradient} rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl transition-all duration-700`}
                  style={{
                    background: `linear-gradient(135deg, ${themeColors.primary600} 0%, ${themeColors.primary700} 50%, ${themeColors.primary700} 100%)`
                  }}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/8 rounded-full -translate-y-24 translate-x-24"></div>
                  <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full translate-y-18 -translate-x-18"></div>
                  <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-white/25 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white/35 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white/45 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                  <div className="absolute top-1/4 left-1/5 w-3 h-3 bg-white/20 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">Discovery Hub</span>
                        <p className="text-white/80 text-sm mt-1">Always Fresh</p>
                      </div>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 leading-tight">Explore & Discover</h2>
                    <p className="text-white/90 mb-8 text-lg leading-relaxed max-w-2xl">Uncover trending topics, discover new connections, and find content that sparks your curiosity and fuels your learning journey!</p>
                    <div className="flex items-center space-x-8">
                      <div className="flex items-center space-x-3 bg-white/15 rounded-2xl px-6 py-3 backdrop-blur-sm border border-white/20">
                        <TrendingUp className="w-5 h-5" />
                        <div>
                          <span className="text-sm font-semibold">Trending Now</span>
                          <p className="text-xs text-white/70">8 hot topics</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 bg-white/15 rounded-2xl px-6 py-3 backdrop-blur-sm border border-white/20">
                        <Sparkles className="w-5 h-5" />
                        <div>
                          <span className="text-sm font-semibold">Curated Content</span>
                          <p className="text-xs text-white/70">15 new finds</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trending Topics */}
                <Card className="bg-white rounded-2xl shadow-sm border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-gray-900 text-xl">
                      <TrendingUp className="w-6 h-6 mr-3 text-primary" />
                      Trending Topics
                      <Badge className="ml-3 bg-primary/10 text-primary border-0">Live</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trendingTopics.map((topic, index) => (
                        <div key={index} className="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-100 hover:border-primary/20 hover:shadow-sm">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 ${topic.color} rounded-xl flex items-center justify-center`}>
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-semibold text-gray-900">{topic.name}</p>
                                {topic.trending && (
                                  <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Hot
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>{topic.posts} posts</span>
                                <span className="text-green-600 font-medium">{topic.growth}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-2 transition-all duration-200">
                              Follow
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-600 rounded-lg p-2">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Posts */}
                <Card className="bg-white rounded-2xl shadow-sm border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-gray-900 text-xl">
                      <Globe className="w-6 h-6 mr-3 text-primary" />
                      Recent Posts
                      <Badge className="ml-3 bg-green-100 text-green-700 border-0">New</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {recentPosts.map((post) => (
                        <div key={post.id} className="group p-6 border border-gray-100 rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-200 bg-white">
                          <div className="flex items-start space-x-4">
                            <div className="relative">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                                  {post.author.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-1 -right-1">
                                <OnlineIndicator size="sm" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="flex items-center space-x-2">
                                  <p className="font-semibold text-gray-900">{post.author}</p>
                                  {post.verified && (
                                    <Badge className="bg-blue-100 text-blue-700 border-0 text-xs px-2 py-0.5">
                                      <Star className="w-3 h-3 mr-1" />
                                      Verified
                                    </Badge>
                                  )}
                                  {post.trending && (
                                    <Badge className="bg-orange-100 text-orange-700 border-0 text-xs px-2 py-0.5">
                                      <TrendingUp className="w-3 h-3 mr-1" />
                                      Trending
                                    </Badge>
                                  )}
                                </div>
                                <Badge className="bg-gray-100 text-gray-700 border-0 text-xs">{post.topic}</Badge>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-500 flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {post.time}
                                </span>
                              </div>
                              <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6 text-sm text-gray-600">
                                  <button className="flex items-center space-x-2 hover:text-primary transition-colors duration-200">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{post.comments}</span>
                                  </button>
                                  <button className="flex items-center space-x-2 hover:text-red-500 transition-colors duration-200">
                                    <Heart className="w-4 h-4" />
                                    <span>{post.likes}</span>
                                  </button>
                                  <button className="flex items-center space-x-2 hover:text-green-500 transition-colors duration-200">
                                    <Share className="w-4 h-4" />
                                    <span>Share</span>
                                  </button>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <Eye className="w-4 h-4" />
                                  <span>{post.views} views</span>
                                </div>
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
                {/* Discovery Insights */}
                <Card className="bg-white rounded-2xl shadow-sm border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-gray-900 text-lg">
                      <Globe className="w-5 h-5 mr-2 text-violet-600" />
                      Discovery Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-violet-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Trending Topics</p>
                            <p className="text-sm text-gray-600">Hot right now</p>
                          </div>
                        </div>
                        <span className="text-3xl font-bold text-violet-600">8</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-fuchsia-50 to-pink-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-fuchsia-100 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-fuchsia-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">New Discoveries</p>
                            <p className="text-sm text-gray-600">This week</p>
                          </div>
                        </div>
                        <span className="text-3xl font-bold text-fuchsia-600">15</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">New Connections</p>
                            <p className="text-sm text-gray-600">Potential friends</p>
                          </div>
                        </div>
                        <span className="text-3xl font-bold text-indigo-600">6</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Suggested Users */}
                <Card className="bg-white rounded-2xl shadow-sm border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-gray-900 text-lg">
                      <Users className="w-5 h-5 mr-2 text-primary" />
                      Suggested Friends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {isLoading ? (
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center space-x-3 p-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                              </div>
                              <div className="w-12 h-6 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                          ))}
                        </div>
                      ) : suggestedUsers.length > 0 ? (
                        suggestedUsers.map((user) => (
                          <div key={user.id} className="group flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-all duration-300">
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={user.profilePicUrl} alt={user.firstName} />
                                <AvatarFallback className="bg-gradient-primary text-white font-semibold text-sm">
                                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-0.5 -right-0.5">
                                <OnlineIndicator size="sm" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-gray-900 text-sm truncate">{user.firstName} {user.lastName}</p>
                                <Star className="w-3 h-3 text-yellow-500" />
                              </div>
                              <p className="text-xs text-gray-500 truncate">Student</p>
                            </div>
                            <Button 
                              size="sm" 
                              className="theme-bg-primary hover:theme-bg-primary/90 text-white rounded-md px-3 py-1.5 text-xs transition-all duration-300 flex-shrink-0"
                              onClick={async () => {
                                try {
                                  const currentUserId = localStorage.getItem('user_id');
                                  if (currentUserId) {
                                    await apiService.sendFriendRequest(currentUserId, user.id);
                                    addToast({
                                      type: 'success',
                                      title: 'Friend request sent',
                                      description: `Friend request sent to ${user.firstName} ${user.lastName}`,
                                    });
                                  }
                                } catch (error) {
                                  addToast({
                                    type: 'error',
                                    title: 'Failed to send friend request',
                                    description: 'Please try again later',
                                  });
                                }
                              }}
                            >
                              Add
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm text-center py-4">No suggested users found</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border-0">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button className="w-full justify-start theme-bg-primary hover:theme-bg-primary/90 text-white rounded-xl py-3 transition-all duration-500">
                        <Plus className="w-4 h-4 mr-3" />
                        Create Post
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-gray-200 hover:theme-border-primary hover:theme-bg-primary hover:text-white rounded-xl py-3 transition-all duration-500">
                        <Hash className="w-4 h-4 mr-3" />
                        Join Topic
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-gray-200 hover:theme-border-primary hover:theme-bg-primary hover:text-white rounded-xl py-3 transition-all duration-500">
                        <Users className="w-4 h-4 mr-3" />
                        Find Friends
                      </Button>
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













