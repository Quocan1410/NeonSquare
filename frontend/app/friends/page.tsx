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
import { Search, Users, UserPlus, MessageCircle, Phone, Video, MoreHorizontal, Filter } from 'lucide-react';

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const friends = [
    {
      id: '1',
      name: 'Jane Smith',
      username: '@janesmith',
      avatar: '/avatar2.jpg',
      isOnline: true,
      lastSeen: 'Online now',
      mutualFriends: 12,
      status: 'Studying for finals',
      grade: 'Grade 12',
      subjects: ['Mathematics', 'Physics', 'Chemistry']
    },
    {
      id: '2',
      name: 'Mike Johnson',
      username: '@mikej',
      avatar: '/avatar3.jpg',
      isOnline: false,
      lastSeen: '2 hours ago',
      mutualFriends: 8,
      status: 'Available',
      grade: 'Grade 12',
      subjects: ['Programming', 'Computer Science']
    },
    {
      id: '3',
      name: 'Sarah Wilson',
      username: '@sarahw',
      avatar: '/avatar4.jpg',
      isOnline: true,
      lastSeen: 'Online now',
      mutualFriends: 15,
      status: 'In a study group',
      grade: 'Grade 11',
      subjects: ['Biology', 'Chemistry', 'English']
    },
    {
      id: '4',
      name: 'Alex Chen',
      username: '@alexc',
      avatar: '/avatar5.jpg',
      isOnline: false,
      lastSeen: '1 day ago',
      mutualFriends: 5,
      status: 'Busy',
      grade: 'Grade 12',
      subjects: ['Mathematics', 'Physics']
    },
    {
      id: '5',
      name: 'Emma Davis',
      username: '@emmad',
      avatar: '/avatar6.jpg',
      isOnline: true,
      lastSeen: 'Online now',
      mutualFriends: 20,
      status: 'Looking for study partners',
      grade: 'Grade 12',
      subjects: ['Literature', 'History', 'Art']
    }
  ];

  const friendRequests = [
    {
      id: 'r1',
      name: 'David Brown',
      username: '@davidb',
      avatar: '/avatar7.jpg',
      mutualFriends: 3,
      grade: 'Grade 12',
      subjects: ['Programming', 'Mathematics']
    },
    {
      id: 'r2',
      name: 'Lisa Garcia',
      username: '@lisag',
      avatar: '/avatar8.jpg',
      mutualFriends: 7,
      grade: 'Grade 11',
      subjects: ['Biology', 'Chemistry']
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Friends', count: friends.length },
    { id: 'online', label: 'Online', count: friends.filter(f => f.isOnline).length },
    { id: 'requests', label: 'Requests', count: friendRequests.length }
  ];

  const filteredFriends = friends.filter(friend => {
    if (activeTab === 'online') return friend.isOnline;
    if (activeTab === 'requests') return false;
    return friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           friend.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
                    <Breadcrumb items={[{ label: 'Friends', current: true }]} />
                    <h1 className="text-2xl font-bold text-forum-primary mt-1">Friends</h1>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forum-secondary w-4 h-4" />
                    <Input
                      placeholder="Search friends..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-80 input-forum"
                      aria-label="Search friends"
                      role="searchbox"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button variant="outline" className="btn-forum">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button className="btn-primary hover-glow">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Friends
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="forum-content space-y-6">
            {/* Tabs */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-forum-secondary hover:text-forum-primary'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Friends List */}
            {activeTab === 'requests' ? (
              <Card className="forum-card">
                <CardHeader>
                  <CardTitle className="text-forum-primary">Friend Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {friendRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border border-border rounded-lg premium-hover">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <Avatar className="avatar-forum w-12 h-12">
                              <AvatarFallback className="gradient-primary text-primary-foreground">
                                {request.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <h3 className="font-semibold text-forum-primary">{request.name}</h3>
                            <p className="text-sm text-forum-secondary">{request.username}</p>
                            <p className="text-xs text-forum-secondary">{request.mutualFriends} mutual friends</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {request.subjects.map((subject, index) => (
                                <Badge key={index} className="badge-forum text-xs">{subject}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" className="btn-primary">
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" className="btn-forum">
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFriends.map((friend) => (
                  <Card key={friend.id} className="forum-card premium-hover">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="avatar-forum w-12 h-12">
                              <AvatarFallback className="gradient-primary text-primary-foreground">
                                {friend.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1">
                              <OnlineIndicator size="sm" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-forum-primary">{friend.name}</h3>
                            <p className="text-sm text-forum-secondary">{friend.username}</p>
                            <p className="text-xs text-forum-secondary">{friend.lastSeen}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="btn-forum">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-forum-primary font-medium">{friend.status}</p>
                          <p className="text-xs text-forum-secondary">{friend.grade}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {friend.subjects.map((subject, index) => (
                            <Badge key={index} className="badge-forum text-xs">{subject}</Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <span className="text-xs text-forum-secondary">
                            {friend.mutualFriends} mutual friends
                          </span>
                          <div className="flex items-center space-x-1">
                            <Button size="sm" variant="ghost" className="btn-forum">
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="btn-forum">
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="btn-forum">
                              <Video className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
