'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { CreatePost } from '@/components/posts/CreatePost';
import { PostCard } from '@/components/posts/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { PostCardSkeleton } from '@/components/ui/skeleton';
import { NoPostsEmptyState } from '@/components/ui/empty-state';
import { ToastContainer, addToast } from '@/components/ui/toast';
import { SkipLink, useKeyboardShortcuts, useScreenReaderAnnouncement, ScreenReaderAnnouncement } from '@/components/ui/accessibility';
import { NotificationDropdown } from '@/components/ui/notification-dropdown';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Post } from '@/lib/api';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  MessageCircle, 
  Users, 
  TrendingUp,
  Filter,
  MoreHorizontal
} from 'lucide-react';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const { user, isAuthenticated } = useAuth();
  const { announcement, announce } = useScreenReaderAnnouncement();

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated, announce]);

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
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'trending') return matchesSearch && post.reactionCount > 10;
    if (activeFilter === 'recent') return matchesSearch && new Date(post.updateAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    return matchesSearch;
  });

  const filters = [
    { id: 'all', label: 'All Posts' },
    { id: 'trending', label: 'Trending' },
    { id: 'recent', label: 'Recent' },
    { id: 'friends', label: 'Friends' }
  ];

  return (
    <div className="min-h-screen forum-layout">
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
        <main id="main-content" className="flex-1 forum-main" role="main">
          {/* Header */}
          <div className="sticky top-0 z-10 glass-effect border-b border-border">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <Breadcrumb items={[{ label: 'Community', current: true }]} />
                    <h1 className="text-2xl font-bold text-forum-primary mt-1">Community</h1>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forum-secondary w-4 h-4" />
                    <Input
                      placeholder="Search posts, people..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-80 input-forum"
                      aria-label="Search posts and people"
                      role="searchbox"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <NotificationDropdown />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="forum-content space-y-6">
            

            {/* Create Post */}
            <CreatePost />

            {/* Filters */}
            <div className="flex items-center justify-between">
              <div 
                className="flex space-x-1 bg-muted p-1 rounded-lg"
                role="tablist"
                aria-label="Filter posts"
              >
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeFilter === filter.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-forum-secondary hover:text-forum-primary'
                    }`}
                    role="tab"
                    aria-selected={activeFilter === filter.id}
                    aria-controls={`${filter.id}-panel`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              
              <Button variant="ghost" size="sm" className="btn-forum">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Posts Feed */}
            <div 
              className="space-y-4"
              role="tabpanel"
              aria-label="Posts feed"
            >
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="post-card p-6">
                    <PostCardSkeleton />
                  </div>
                ))
              ) : filteredPosts.length === 0 ? (
                // Empty state
                <div className="post-card p-6">
                  <NoPostsEmptyState />
                </div>
              ) : (
                // Actual posts
                filteredPosts.map((post) => (
                  <div key={post.id} className="post-card p-6 premium-hover">
                    <PostCard post={post} />
                  </div>
                ))
              )}
            </div>

            {/* Load More */}
            <div className="text-center py-8">
              <Button variant="outline" className="px-8 btn-forum">
                Load More Posts
              </Button>
            </div>
          </div>
        </main>
      </div>
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}