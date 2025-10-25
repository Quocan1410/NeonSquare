'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { CreatePost } from '@/components/posts/CreatePost';
import { PostCard } from '@/components/posts/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { PostCardSkeleton } from '@/components/ui/skeleton';
import { NoPostsEmptyState } from '@/components/ui/empty-state';
import { ToastContainer, addToast } from '@/components/ui/toast';
import { SkipLink, useKeyboardShortcuts, useScreenReaderAnnouncement, ScreenReaderAnnouncement } from '@/components/ui/accessibility';
import { NotificationDropdown } from '@/components/ui/notification-dropdown';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { apiService, Post } from '@/lib/api';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  MessageCircle, 
  Users, 
  Home,
  Sparkles,
  Zap,
  Target,
  Globe,
  Clock,
  Heart,
  Share2,
  BookOpen,
  Star,
  Hash
} from 'lucide-react';

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
  const { user, isAuthenticated } = useAuth();
  const { themeColors } = useTheme();
  const { announcement, announce } = useScreenReaderAnnouncement();

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      // Add delay to ensure BE is ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      const fetchedPosts = await apiService.getPosts();
      setPosts(fetchedPosts);
      announce('Posts loaded successfully');
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      addToast({
        type: 'error',
        title: 'Failed to load posts',
        description: 'Please try again later',
      });
      // Fallback to empty array if API fails
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated, announce]);

  // Listen for post creation events
  useEffect(() => {
    const handlePostCreated = () => {
      fetchPosts();
    };

    window.addEventListener('postCreated', handlePostCreated);
    return () => window.removeEventListener('postCreated', handlePostCreated);
  }, []);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+k': () => {
      // Focus search input
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      searchInput?.focus();
    },
    'ctrl+n': () => {
      // Create new post
      addToast({
        type: 'info',
        title: 'Create Post',
        description: 'Use the Create Post button to share something new!'
      });
    },
    'ctrl+1': () => {
      // Go to home
      window.location.href = '/dashboard';
    },
    'ctrl+2': () => {
      // Focus notification dropdown
      const notificationButton = document.querySelector('[aria-label*="Notifications"]') as HTMLButtonElement;
      notificationButton?.click();
    },
    'ctrl+3': () => {
      // Go to messages
      window.location.href = '/messages';
    }
  });


  // Filter posts based on search and active filter
  // Filter posts by search query
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);


  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Skip Links */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>
      
      {/* Screen Reader Announcements */}
      {announcement && (
        <ScreenReaderAnnouncement 
          message={announcement.message} 
          priority={announcement.priority} 
        />
      )}
      
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <main id="main-content" className="flex-1 min-h-screen" role="main">
          {/* Modern Header */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div>
                    <Breadcrumb items={[{ label: 'Home', current: true }]} />
                    <h1 className="text-3xl font-bold text-gray-900 mt-1 flex items-center">
                      <Home className="w-8 h-8 text-primary mr-3" />
                      Community
                    </h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's what's happening in your community</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search posts, people..."
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
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                  <NotificationDropdown />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Community Hero Section */}
                <div 
                  className={`bg-gradient-to-br ${themeColors.gradient} rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl transition-all duration-700`}
                  style={{
                    background: `linear-gradient(135deg, ${themeColors.primary600} 0%, ${themeColors.primary700} 50%, ${themeColors.primary700} 100%)`
                  }}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/8 rounded-full -translate-y-24 translate-x-24"></div>
                  <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full translate-y-18 -translate-x-18"></div>
                  <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-white/25 rounded-full animate-pulse"></div>
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/35 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-1/3 right-1/5 w-1 h-1 bg-white/45 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">Community Hub</span>
                        <p className="text-white/80 text-sm mt-1">Live Activity</p>
                      </div>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 leading-tight">{themeColors.description}</h2>
                    <p className="text-white/90 mb-8 text-lg leading-relaxed max-w-2xl">Your {themeColors.name.toLowerCase()} is buzzing with activity. Join the conversation, share your knowledge, and connect with like-minded students!</p>
                    <div className="flex items-center space-x-8">
                      <div className="flex items-center space-x-3 bg-white/15 rounded-2xl px-6 py-3 backdrop-blur-sm border border-white/20">
                        <MessageCircle className="w-5 h-5" />
                        <div>
                          <span className="text-sm font-semibold">{posts.length} Posts Today</span>
                          <p className="text-xs text-white/70">+12% from yesterday</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 bg-white/15 rounded-2xl px-6 py-3 backdrop-blur-sm border border-white/20">
                        <Users className="w-5 h-5" />
                        <div>
                          <span className="text-sm font-semibold">24 Active Members</span>
                          <p className="text-xs text-white/70">Online now</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Create Post */}
                <div className="bg-white rounded-2xl shadow-sm border-0">
                  <CreatePost />
                </div>

                {/* Filters */}

                {/* Posts Feed */}
                <div 
                  className="space-y-6"
                  role="tabpanel"
                  aria-label="Posts feed"
                >
                  {isLoading ? (
                    // Loading skeletons
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="bg-white rounded-2xl shadow-sm border-0 p-6">
                        <PostCardSkeleton />
                      </div>
                    ))
                  ) : currentPosts.length === 0 ? (
                    // Empty state
                    <div className="bg-white rounded-2xl shadow-sm border-0 p-8">
                      <NoPostsEmptyState />
                    </div>
                  ) : (
                    // Actual posts (max 3 per page)
                    currentPosts.map((post) => (
                      <div key={post.id} className="bg-white rounded-2xl shadow-sm border-0 p-6 hover:shadow-lg transition-all duration-200">
                        <PostCard post={post} />
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} posts
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 rounded-lg"
                        >
                          Previous
                        </Button>
                        <div className="flex space-x-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="px-3 py-2 rounded-lg min-w-[40px]"
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 rounded-lg"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Community Sidebar */}
              <div className="space-y-6">
                {/* Community Activity */}
                <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-primary" />
                    Community Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <MessageCircle className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">New Posts</p>
                          <p className="text-sm text-gray-600">Last 24 hours</p>
                        </div>
                      </div>
                      <span className="text-3xl font-bold text-blue-600">{posts.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Heart className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Likes Received</p>
                          <p className="text-sm text-gray-600">This week</p>
                        </div>
                      </div>
                      <span className="text-3xl font-bold text-green-600">42</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Share2 className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Shares</p>
                          <p className="text-sm text-gray-600">Your content</p>
                        </div>
                      </div>
                      <span className="text-3xl font-bold text-purple-600">18</span>
                    </div>
                  </div>
                </div>

                {/* Hot Topics */}
                <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-red-500" />
                    Hot Topics
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Study Tips', posts: 89, trend: 'up', color: 'bg-red-100 text-red-700' },
                      { name: 'Exam Prep', posts: 67, trend: 'up', color: 'bg-orange-100 text-orange-700' },
                      { name: 'Group Study', posts: 45, trend: 'up', color: 'bg-yellow-100 text-yellow-700' },
                      { name: 'Career Advice', posts: 34, trend: 'down', color: 'bg-blue-100 text-blue-700' }
                    ].map((topic, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${topic.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Hash className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">#{topic.name}</p>
                            <p className="text-sm text-gray-600">{topic.posts} posts</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className={`w-4 h-4 ${topic.trend === 'up' ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
                          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-lg px-3 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            Join
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Community Leaders */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border-0 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    Community Leaders
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Alex Chen', points: 1250, badge: 'Top Contributor' },
                      { name: 'Emma Davis', points: 980, badge: 'Helper' },
                      { name: 'David Brown', points: 750, badge: 'Rising Star' }
                    ].map((leader, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {leader.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{leader.name}</p>
                            <p className="text-xs text-gray-600">{leader.points} points</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-700 border-0 text-xs">
                          {leader.badge}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}