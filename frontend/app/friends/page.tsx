'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { OnlineIndicator } from '@/components/ui/online-indicator';
import { Search, Users, UserPlus, MessageCircle, Phone, Video, MoreHorizontal, Filter, Check, X } from 'lucide-react';
import { apiService, User } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { addToast } from '@/components/ui/toast';

interface Friend extends User {
  mutualFriends?: number;
  status?: string;
  grade?: string;
  subjects?: string[];
}

interface FriendRequest extends User {
  mutualFriends?: number;
  status?: string;
  grade?: string;
  subjects?: string[];
}

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setIsLoading(true);
        // TODO: Implement actual friends API endpoints
        // const friendsData = await apiService.getFriends();
        // const requestsData = await apiService.getFriendRequests();
        // setFriends(friendsData);
        // setFriendRequests(requestsData);
        
        // For now, using empty arrays until backend endpoints are ready
        setFriends([]);
        setFriendRequests([]);
      } catch (error) {
        console.error('Failed to fetch friends:', error);
        addToast({
          type: 'error',
          title: 'Failed to load friends',
          description: 'Please try again later',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchFriends();
    }
  }, [user]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      // TODO: Implement accept friend request API
      // await apiService.acceptFriendRequest(requestId);
      addToast({
        type: 'success',
        title: 'Friend request accepted',
        description: 'You are now friends!',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to accept request',
        description: 'Please try again later',
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      // TODO: Implement reject friend request API
      // await apiService.rejectFriendRequest(requestId);
      addToast({
        type: 'success',
        title: 'Friend request rejected',
        description: 'Request has been declined',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to reject request',
        description: 'Please try again later',
      });
    }
  };

  const handleSendMessage = (friendId: string) => {
    // TODO: Navigate to messages with this friend
    addToast({
      type: 'info',
      title: 'Opening chat',
      description: 'Starting conversation...',
    });
  };

  const filteredFriends = friends.filter(friend =>
    friend.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineFriends = filteredFriends.filter(friend => friend.isOnline);

  return (
    <div className="min-h-screen forum-layout">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 forum-main">
          <div className="p-6">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/dashboard' },
                { label: 'Friends', href: '/friends' }
              ]}
            />

            <div className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-forum-primary">Friends</h1>
                  <p className="text-forum-secondary mt-1">Connect with your study partners</p>
                </div>
                <Button className="btn-primary">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friends
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forum-secondary w-4 h-4" />
                  <Input
                    placeholder="Search friends..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 input-forum"
                  />
                </div>
                <Button variant="outline" className="btn-outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="forum-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Users className="w-5 h-5 mr-2 text-primary" />
                      Total Friends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-forum-primary">{friends.length}</div>
                    <p className="text-sm text-forum-secondary mt-1">Study partners</p>
                  </CardContent>
                </Card>

                <Card className="forum-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <OnlineIndicator showText={false} />
                      <span className="ml-2">Online Now</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-forum-primary">{onlineFriends.length}</div>
                    <p className="text-sm text-forum-secondary mt-1">Available to chat</p>
                  </CardContent>
                </Card>

                <Card className="forum-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <UserPlus className="w-5 h-5 mr-2 text-accent" />
                      Pending Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-forum-primary">{friendRequests.length}</div>
                    <p className="text-sm text-forum-secondary mt-1">Awaiting response</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-forum-primary mb-4">All Friends</h2>
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <Card key={i} className="forum-card animate-pulse">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-forum-secondary/20 rounded-full"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-forum-secondary/20 rounded w-3/4"></div>
                                <div className="h-3 bg-forum-secondary/20 rounded w-1/2"></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : filteredFriends.length === 0 ? (
                    <Card className="forum-card">
                      <CardContent className="p-8 text-center">
                        <Users className="w-12 h-12 text-forum-secondary/50 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-forum-primary mb-2">No friends yet</h3>
                        <p className="text-forum-secondary mb-4">Start connecting with your study partners!</p>
                        <Button className="btn-primary">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Find Friends
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredFriends.map((friend) => (
                        <Card key={friend.id} className="forum-card hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage src={friend.profilePicUrl} alt={`${friend.firstName} ${friend.lastName}`} />
                                  <AvatarFallback className="gradient-primary text-primary-foreground">
                                    {friend.firstName.charAt(0)}{friend.lastName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold text-forum-primary">
                                    {friend.firstName} {friend.lastName}
                                  </h3>
                                  <div className="flex items-center space-x-2">
                                    <OnlineIndicator showText={false} />
                                    <span className="text-sm text-forum-secondary">
                                      {friend.isOnline ? 'Online' : friend.lastSeen}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>

                            {friend.status && (
                              <p className="text-sm text-forum-secondary mb-3">{friend.status}</p>
                            )}

                            {friend.subjects && friend.subjects.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {friend.subjects.slice(0, 3).map((subject, index) => (
                                  <Badge key={index} variant="secondary" className="badge-forum text-xs">
                                    {subject}
                                  </Badge>
                                ))}
                                {friend.subjects.length > 3 && (
                                  <Badge variant="secondary" className="badge-forum text-xs">
                                    +{friend.subjects.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}

                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                className="btn-primary flex-1"
                                onClick={() => handleSendMessage(friend.id)}
                              >
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Message
                              </Button>
                              <Button size="sm" variant="outline" className="btn-outline">
                                <Phone className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="btn-outline">
                                <Video className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {friendRequests.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-forum-primary mb-4">Friend Requests</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {friendRequests.map((request) => (
                        <Card key={request.id} className="forum-card">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={request.profilePicUrl} alt={`${request.firstName} ${request.lastName}`} />
                                <AvatarFallback className="gradient-primary text-primary-foreground">
                                  {request.firstName.charAt(0)}{request.lastName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-forum-primary">
                                  {request.firstName} {request.lastName}
                                </h3>
                                <p className="text-sm text-forum-secondary">
                                  {request.mutualFriends} mutual friends
                                </p>
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                className="btn-primary flex-1"
                                onClick={() => handleAcceptRequest(request.id)}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="btn-outline flex-1"
                                onClick={() => handleRejectRequest(request.id)}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Decline
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}