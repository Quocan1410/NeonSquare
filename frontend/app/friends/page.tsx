// NeonSquare/frontend/app/friends/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { OnlineIndicator } from '@/components/ui/online-indicator';
import {
  Search,
  Users,
  UserPlus,
  MessageCircle,
  Phone,
  Video,
  MoreHorizontal,
  Filter,
  Check,
  X,
  Clock,
  Globe,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { apiService, User } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { addToast } from '@/components/ui/toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Friend = User & {
  mutualFriends?: number;
  status?: string;
  grade?: string;
  subjects?: string[];
};

type PendingRequest = {
  requestId: string;
  from: User; // the sender (who asked to be your friend)
  mutualFriends?: number;
};

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { themeColors } = useTheme();
  const router = useRouter();

  // Load friends + pending requests (inbound)
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setIsLoading(true);
        // tiny delay in case BE just started
        await new Promise((r) => setTimeout(r, 400));
        if (!user?.id) return;

        const [friendsData, requestsData] = await Promise.all([
          apiService.getFriends(user.id),
          apiService.getFriendRequests(user.id),
        ]);

        setFriends(Array.isArray(friendsData) ? friendsData : []);

        // Normalize requests -> { requestId, from: User }
        const normalized: PendingRequest[] = (Array.isArray(requestsData) ? requestsData : [])
          .map((f: any) => {
            const from: any = f?.sender;
            const reqId: string | undefined = f?.id;
            if (!from?.id || !reqId) return null;

            // Tolerate BE shapes: profilePicUrl or legacy profilePic
            const picUrl: string | undefined =
              from?.profilePicUrl ??
              (typeof from?.profilePic === 'string' ? from.profilePic : undefined);

            return {
              requestId: String(reqId),
              from: {
                id: String(from.id),
                firstName: String(from.firstName ?? 'Unknown'),
                lastName: String(from.lastName ?? 'User'),
                email: String(from.email ?? ''),
                profilePicUrl: picUrl,
                status: from.status ?? 'ACTIVE',
                isOnline: Boolean(from.isOnline ?? false),
                lastSeen: from.lastSeen ?? new Date().toISOString(),
              },
              mutualFriends: 0,
            } as PendingRequest;
          })
          .filter(Boolean) as PendingRequest[];

        setFriendRequests(normalized);
      } catch (error) {
        console.error('Failed to fetch friends:', error);
        addToast({
          type: 'error',
          title: 'Failed to load friends',
          description: 'Please try again later',
        });
        setFriends([]);
        setFriendRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchFriends();
  }, [user]);

  // Accept/Reject actions use the *friendship request id*
  const handleAcceptRequest = async (requestId: string) => {
    try {
      await apiService.acceptFriendRequest(requestId);
      addToast({
        type: 'success',
        title: 'Friend request accepted',
        description: 'You are now friends!',
      });
      await refreshLists();
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
      await apiService.rejectFriendRequest(requestId);
      addToast({
        type: 'success',
        title: 'Friend request rejected',
        description: 'Request has been declined',
      });
      await refreshLists();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to reject request',
        description: 'Please try again later',
      });
    }
  };

  const refreshLists = async () => {
    if (!user?.id) return;
    const [friendsData, requestsData] = await Promise.all([
      apiService.getFriends(user.id),
      apiService.getFriendRequests(user.id),
    ]);
    setFriends(Array.isArray(friendsData) ? friendsData : []);
    const normalized: PendingRequest[] = (Array.isArray(requestsData) ? requestsData : [])
      .map((f: any) => {
        const from: any = f?.sender;
        const reqId: string | undefined = f?.id;
        if (!from?.id || !reqId) return null;

        const picUrl: string | undefined =
          from?.profilePicUrl ??
          (typeof from?.profilePic === 'string' ? from.profilePic : undefined);

        return {
          requestId: String(reqId),
          from: {
            id: String(from.id),
            firstName: String(from.firstName ?? 'Unknown'),
            lastName: String(from.lastName ?? 'User'),
            email: String(from.email ?? ''),
            profilePicUrl: picUrl,
            status: from.status ?? 'ACTIVE',
            isOnline: Boolean(from.isOnline ?? false),
            lastSeen: from.lastSeen ?? new Date().toISOString(),
          },
          mutualFriends: 0,
        } as PendingRequest;
      })
      .filter(Boolean) as PendingRequest[];
    setFriendRequests(normalized);
  };

  // Open or create a chat with a friend, then navigate to /messages
  const handleSendMessage = async (friendId: string) => {
    if (!user?.id) return;
    try {
      const conv = await apiService.chatGetOrCreateConversation(user.id, friendId);
      router.push(`/messages?c=${encodeURIComponent(conv.id)}`);
    } catch (e) {
      console.error(e);
      addToast({
        type: 'error',
        title: 'Could not open chat',
        description: 'Please try again.',
      });
    }
  };

  const filteredFriends = useMemo(
    () =>
      friends.filter((friend) =>
        `${friend.firstName ?? ''} ${friend.lastName ?? ''}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [friends, searchQuery]
  );

  const onlineFriends = filteredFriends.filter((friend) => friend.isOnline);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen">
          {/* Header */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div>
                    <Breadcrumb
                      items={[
                        { label: 'Home', href: '/dashboard' },
                        { label: 'Friends', current: true },
                      ]}
                    />
                    <h1 className="text-3xl font-bold text-gray-900 mt-1 flex items-center">
                      <Users className="w-8 h-8 text-primary mr-3" />
                      Friends
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Connect with your study partners and build meaningful relationships
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    className="theme-bg-primary hover:theme-bg-primary/90 text-white px-6 py-3 rounded-xl transition-all duration-500"
                    onClick={() => {
                      const searchInput = document.querySelector(
                        'input[placeholder*="Search"]'
                      ) as HTMLInputElement | null;
                      if (searchInput) searchInput.focus();
                    }}
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add Friends
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Hero */}
                <div
                  className="rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl transition-all duration-700"
                  style={{
                    background: `linear-gradient(135deg, ${themeColors.primary600} 0%, ${themeColors.primary700} 50%, ${themeColors.primary700} 100%)`,
                  }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                          Your Network
                        </span>
                        <p className="text-white/80 text-sm mt-1">Growing Strong</p>
                      </div>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 leading-tight">Expand Your Circle</h2>
                    <p className="text-white/90 mb-8 text-lg leading-relaxed max-w-2xl">
                      Connect with like-minded students, build study groups, and create lasting
                      academic partnerships that will shape your future!
                    </p>
                    <div className="flex items-center space-x-8">
                      <div className="flex items-center space-x-3 bg-white/15 rounded-2xl px-6 py-3 backdrop-blur-sm border border-white/20">
                        <Users className="w-5 h-5" />
                        <div>
                          <span className="text-sm font-semibold">{friends.length} Connections</span>
                          <p className="text-xs text-white/70">+3 this week</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 bg-white/15 rounded-2xl px-6 py-3 backdrop-blur-sm border border-white/20">
                        <Globe className="w-5 h-5" />
                        <div>
                          <span className="text-sm font-semibold">
                            {onlineFriends.length} Online Now
                          </span>
                          <p className="text-xs text-white/70">Ready to chat</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Search friends..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="px-6 py-3 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200"
                    >
                      <Filter className="w-5 h-5 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold text-gray-900">Total Friends</h3>
                        </div>
                        <div className="text-3xl font-bold text-primary">{friends.length}</div>
                        <p className="text-sm text-gray-600 mt-1">Study partners</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <h3 className="text-lg font-semibold text-gray-900">Online Now</h3>
                        </div>
                        <div className="text-3xl font-bold text-green-600">{onlineFriends.length}</div>
                        <p className="text-sm text-gray-600 mt-1">Available to chat</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Globe className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <UserPlus className="w-5 h-5 text-orange-600" />
                          <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
                        </div>
                        <div className="text-3xl font-bold text-orange-600">{friendRequests.length}</div>
                        <p className="text-sm text-gray-600 mt-1">Awaiting response</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Friends List */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <Users className="w-6 h-6 mr-2 text-primary" />
                      All Friends
                    </h2>

                    {isLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-white rounded-2xl shadow-sm border-0 p-6 animate-pulse"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-full" />
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : filteredFriends.length === 0 ? (
                      <div className="bg-white rounded-2xl shadow-sm border-0 p-8 text-center">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No friends yet</h3>
                        <p className="text-gray-600 mb-6">Start connecting with your study partners!</p>
                        <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl">
                          <UserPlus className="w-5 h-5 mr-2" />
                          Find Friends
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFriends.map((friend) => {
                          const fFirst = friend.firstName ?? '';
                          const fLast = friend.lastName ?? '';
                          const initials = (fFirst.charAt(0) || 'U') + (fLast.charAt(0) || '');
                          return (
                            <div
                              key={friend.id}
                              className="bg-white rounded-2xl shadow-sm border-0 p-6 hover:shadow-lg transition-all duration-200"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                  <div className="relative">
                                    <Avatar className="w-14 h-14">
                                      <AvatarImage
                                        src={friend.profilePicUrl}
                                        alt={`${fFirst} ${fLast}`}
                                      />
                                      <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                                        {initials}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1">
                                      <OnlineIndicator size="sm" />
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">
                                      {fFirst} {fLast}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-600">
                                        {friend.isOnline ? 'Online now' : friend.lastSeen}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  asChild
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <Link href={`/profile?userId=${friend.id}`}>
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Link>
                                </Button>
                              </div>

                              {friend.status && (
                                <p className="text-sm text-gray-600 mb-4">{friend.status}</p>
                              )}

                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90 text-white flex-1 rounded-xl py-2"
                                  onClick={() => handleSendMessage(friend.id)}
                                >
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Message
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-200 hover:bg-gray-50 rounded-xl px-3"
                                  asChild
                                >
                                  <Link href={`/profile?userId=${friend.id}`}>
                                    <Phone className="w-4 h-4" />
                                  </Link>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-200 hover:bg-gray-50 rounded-xl px-3"
                                  asChild
                                >
                                  <Link href={`/profile?userId=${friend.id}`}>
                                    <Video className="w-4 h-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Inbound Friend Requests */}
                  {friendRequests.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <UserPlus className="w-6 h-6 mr-2 text-orange-600" />
                        Friend Requests
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {friendRequests.map((req) => {
                          const first = req.from.firstName ?? '';
                          const last = req.from.lastName ?? '';
                          const initials = (first.charAt(0) || 'U') + (last.charAt(0) || '');
                          return (
                            <div
                              key={req.requestId}
                              className="bg-white rounded-2xl shadow-sm border-0 p-6 hover:shadow-lg transition-all duration-200"
                            >
                              <div className="flex items-center space-x-4 mb-4">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage
                                    src={req.from.profilePicUrl}
                                    alt={`${first} ${last}`}
                                  />
                                  <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                                    {initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {first} {last}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {req.mutualFriends ?? 0} mutual friends
                                  </p>
                                </div>
                              </div>

                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white flex-1 rounded-xl py-2"
                                  onClick={() => handleAcceptRequest(req.requestId)}
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-200 text-red-600 hover:bg-red-50 flex-1 rounded-xl py-2"
                                  onClick={() => handleRejectRequest(req.requestId)}
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Decline
                                </Button>
                              </div>

                              <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="mt-2 w-full text-primary"
                              >
                                <Link href={`/profile?userId=${req.from.id}`}>View profile</Link>
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Network Insights */}
                <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-emerald-600" />
                    Network Insights
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Total Connections</p>
                          <p className="text-sm text-gray-600">Your network</p>
                        </div>
                      </div>
                      <span className="text-3xl font-bold text-emerald-600">{friends.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                          <Globe className="w-6 h-6 text-cyan-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Active Now</p>
                          <p className="text-sm text-gray-600">Online friends</p>
                        </div>
                      </div>
                      <span className="text-3xl font-bold text-cyan-600">{onlineFriends.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Pending</p>
                          <p className="text-sm text-gray-600">Awaiting response</p>
                        </div>
                      </div>
                      <span className="text-3xl font-bold text-orange-600">{friendRequests.length}</span>
                    </div>
                  </div>
                </div>

                {/* Study Groups */}
                <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 theme-primary" />
                    Study Groups
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Math Study Group', members: 8, subject: 'Mathematics' },
                      { name: 'Physics Lab', members: 6, subject: 'Physics' },
                      { name: 'CS Projects', members: 12, subject: 'Computer Science' },
                      { name: 'Biology Club', members: 5, subject: 'Biology' },
                    ].map((group, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="w-5 h-5 theme-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{group.name}</p>
                            <p className="text-sm text-gray-600">
                              {group.members} members • {group.subject}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-3 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Join
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-0 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-emerald-600" />
                    Suggested Connections
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Alex Chen', mutual: 3, subjects: ['Math', 'Physics'], compatibility: 95 },
                      { name: 'Emma Davis', mutual: 5, subjects: ['Science', 'Bio'], compatibility: 88 },
                      { name: 'David Brown', mutual: 2, subjects: ['Programming', 'CS'], compatibility: 92 },
                    ].map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white/70 rounded-xl hover:bg-white transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {suggestion.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{suggestion.name}</p>
                            <p className="text-xs text-gray-600">
                              {suggestion.mutual} mutual • {suggestion.compatibility}% match
                            </p>
                          </div>
                        </div>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-3 py-1 text-xs">
                          Connect
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
