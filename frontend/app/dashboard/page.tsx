'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { CreatePost } from '@/components/posts/CreatePost';
import { PostCard } from '@/components/posts/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  Bell, 
  MessageCircle, 
  Users, 
  TrendingUp,
  Filter,
  MoreHorizontal
} from 'lucide-react';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Simple user data
  const user = {
    id: '1',
    fullName: 'John Doe',
    profilePic: '/avatar.jpg',
    isOnline: true
  };

  // Simple posts data
  const posts = [
    {
      id: '1',
      text: 'Math exam today was so hard! Does anyone have study tips?',
      user: {
        fullName: 'Jane Smith',
        profilePic: '/avatar2.jpg',
        isOnline: true
      },
      time: '2 hours ago',
      likes: 12,
      comments: 5,
      isLiked: false
    },
    {
      id: '2',
      text: 'Sharing Physics study materials for Grade 12 students. Check the link in comments!',
      user: {
        fullName: 'Mike Johnson',
        profilePic: '/avatar3.jpg',
        isOnline: false
      },
      time: '4 hours ago',
      likes: 8,
      comments: 3,
      isLiked: true
    },
    {
      id: '3',
      text: 'Anyone interested in forming a study group for Chemistry?',
      user: {
        fullName: 'Sarah Wilson',
        profilePic: '/avatar4.jpg',
        isOnline: true
      },
      time: '6 hours ago',
      likes: 15,
      comments: 8,
      isLiked: false
    }
  ];

  const filters = [
    { id: 'all', label: 'All Posts' },
    { id: 'trending', label: 'Trending' },
    { id: 'recent', label: 'Recent' },
    { id: 'friends', label: 'Friends' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 bg-background">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold text-foreground">Community</h1>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search posts, people..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </Button>
                  <Button className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            

            {/* Create Post */}
            <CreatePost />

            {/* Filters */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeFilter === filter.id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center py-8">
              <Button variant="outline" className="px-8">
                Load More Posts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}