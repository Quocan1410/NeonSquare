'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Bell, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Share, 
  Bookmark,
  Check,
  X,
  MoreHorizontal,
  Filter,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

const notifications = [
  {
    id: '1',
    type: 'like',
    user: {
      fullName: 'Sarah Wilson',
      username: '@sarahw',
      profilePic: '/avatars/03.png'
    },
    action: 'liked your post',
    target: 'Math exam today was so hard!',
    time: '5 minutes ago',
    isRead: false,
    postId: '1'
  },
  {
    id: '2',
    type: 'comment',
    user: {
      fullName: 'Mike Johnson',
      username: '@mikej',
      profilePic: '/avatars/02.png'
    },
    action: 'commented on your post',
    target: 'Math exam today was so hard!',
    content: 'I found that practicing with Khan Academy really helped me with calculus.',
    time: '1 hour ago',
    isRead: false,
    postId: '1'
  },
  {
    id: '3',
    type: 'follow',
    user: {
      fullName: 'Alex Chen',
      username: '@alexc',
      profilePic: '/avatars/04.png'
    },
    action: 'started following you',
    time: '2 hours ago',
    isRead: true
  },
  {
    id: '4',
    type: 'share',
    user: {
      fullName: 'Emma Davis',
      username: '@emmad',
      profilePic: '/avatars/05.png'
    },
    action: 'shared your post',
    target: 'Sharing some useful resources for learning React',
    time: '3 hours ago',
    isRead: true,
    postId: '2'
  },
  {
    id: '5',
    type: 'bookmark',
    user: {
      fullName: 'Tom Brown',
      username: '@tomb',
      profilePic: '/avatars/06.png'
    },
    action: 'bookmarked your post',
    target: 'Attended an amazing tech conference today',
    time: '1 day ago',
    isRead: true,
    postId: '3'
  },
  {
    id: '6',
    type: 'mention',
    user: {
      fullName: 'Lisa Garcia',
      username: '@lisag',
      profilePic: '/avatars/07.png'
    },
    action: 'mentioned you in a post',
    target: 'Thanks @johndoe for the great study tips!',
    time: '2 days ago',
    isRead: true,
    postId: '4'
  }
];

const notificationTypes = [
  { id: 'all', label: 'All', count: notifications.length },
  { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.isRead).length },
  { id: 'likes', label: 'Likes', count: notifications.filter(n => n.type === 'like').length },
  { id: 'comments', label: 'Comments', count: notifications.filter(n => n.type === 'comment').length },
  { id: 'follows', label: 'Follows', count: notifications.filter(n => n.type === 'follow').length },
  { id: 'mentions', label: 'Mentions', count: notifications.filter(n => n.type === 'mention').length }
];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-destructive" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-primary" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-success" />;
      case 'share':
        return <Share className="w-5 h-5 text-info" />;
      case 'bookmark':
        return <Bookmark className="w-5 h-5 text-warning" />;
      case 'mention':
        return <Bell className="w-5 h-5 text-primary" />;
      default:
        return <Bell className="w-5 h-5 text-forum-secondary" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like':
        return 'bg-destructive/10 border-destructive/20';
      case 'comment':
        return 'bg-primary/10 border-primary/20';
      case 'follow':
        return 'bg-success/10 border-success/20';
      case 'share':
        return 'bg-info/10 border-info/20';
      case 'bookmark':
        return 'bg-warning/10 border-warning/20';
      case 'mention':
        return 'bg-primary/10 border-primary/20';
      default:
        return 'bg-muted/50 border-border';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.isRead;
    return notification.type === activeFilter;
  });

  const handleCheckCircle = (notificationId: string) => {
    console.log('Marking notification as read:', notificationId);
    // Here you would update the notification status
  };

  const handleMarkAllAsRead = () => {
    console.log('Marking all notifications as read');
    // Here you would mark all notifications as read
  };

  const handleDeleteNotification = (notificationId: string) => {
    console.log('Deleting notification:', notificationId);
    // Here you would delete the notification
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
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

              {/* Notification Stats */}
              <div className="forum-card p-4">
                <h4 className="font-semibold text-forum-primary mb-3">Notification Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-forum-secondary">Total</span>
                    <span className="text-forum-primary font-semibold">{notifications.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forum-secondary">Unread</span>
                    <span className="text-forum-primary font-semibold">{notifications.filter(n => !n.isRead).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forum-secondary">Today</span>
                    <span className="text-forum-primary font-semibold">{notifications.filter(n => n.time.includes('minutes') || n.time.includes('hour')).length}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="forum-card p-4">
                <h4 className="font-semibold text-forum-primary mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start btn-forum"
                    onClick={handleMarkAllAsRead}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark All Read
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start btn-forum"
                    onClick={handleSelectAll}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Select All
                  </Button>
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
                  <h1 className="text-3xl font-bold text-forum-primary">Notifications</h1>
                  <p className="text-forum-secondary">Stay updated with your community activity</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" className="btn-forum">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button className="btn-primary hover-glow">
                    <Bell className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg overflow-x-auto">
              {notificationTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveFilter(type.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeFilter === type.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-forum-secondary hover:text-forum-primary'
                  }`}
                >
                  {type.label}
                  {type.count > 0 && (
                    <Badge className="ml-2 bg-primary/20 text-primary text-xs">
                      {type.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="forum-card p-12 text-center">
                  <Bell className="w-16 h-16 text-forum-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-forum-primary mb-2">No notifications</h3>
                  <p className="text-forum-secondary">You're all caught up! Check back later for new updates.</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`forum-card p-4 transition-all duration-200 hover:shadow-medium ${
                      !notification.isRead ? 'ring-2 ring-primary/20' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => handleSelectNotification(notification.id)}
                        className="mt-1 w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                      />

                      {/* Notification Icon */}
                      <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Avatar className="avatar-forum w-8 h-8">
                                <AvatarImage src={notification.user.profilePic} alt={notification.user.fullName} />
                                <AvatarFallback className="gradient-primary text-primary-foreground text-xs">
                                  {notification.user.fullName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="font-semibold text-forum-primary">{notification.user.fullName}</span>
                                <span className="text-forum-secondary ml-1">{notification.action}</span>
                                {notification.target && (
                                  <span className="text-forum-primary ml-1">"{notification.target}"</span>
                                )}
                              </div>
                            </div>
                            
                            {notification.content && (
                              <p className="text-forum-secondary text-sm mt-2 pl-10 italic">
                                "{notification.content}"
                              </p>
                            )}
                            
                            <div className="flex items-center space-x-4 mt-2 pl-10">
                              <span className="text-xs text-forum-secondary">{notification.time}</span>
                              {!notification.isRead && (
                                <Badge className="bg-primary text-primary-foreground text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCheckCircle(notification.id)}
                                className="btn-forum"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="btn-forum text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="btn-forum"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bulk Actions */}
            {selectedNotifications.length > 0 && (
              <div className="forum-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-forum-primary">
                    {selectedNotifications.length} notification{selectedNotifications.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="btn-forum">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Read
                    </Button>
                    <Button variant="outline" size="sm" className="btn-forum text-destructive hover:text-destructive">
                      <X className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
