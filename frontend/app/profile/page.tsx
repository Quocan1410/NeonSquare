'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Settings, 
  MessageCircle, 
  Heart, 
  Share,
  MoreHorizontal,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

const user = {
  id: '1',
  fullName: 'John Doe',
  username: '@johndoe',
  email: 'john.doe@example.com',
  phone: '+1 234 567 8900',
  location: 'San Francisco, CA',
  joinDate: 'January 2023',
  profilePic: '/avatars/user.png',
  coverPic: '/covers/cover.jpg',
  bio: 'Passionate about technology and education. Love sharing knowledge and helping others learn.',
  isOnline: true,
  followers: 1250,
  following: 890,
  posts: 156,
  verified: true
};

const recentPosts = [
  {
    id: '1',
    content: 'Just finished an amazing coding project! The feeling of solving complex problems is incredible.',
    time: '2 hours ago',
    likes: 24,
    comments: 8,
    shares: 3
  },
  {
    id: '2',
    content: 'Sharing some useful resources for learning React. Check out the link in comments!',
    time: '1 day ago',
    likes: 45,
    comments: 12,
    shares: 7
  },
  {
    id: '3',
    content: 'Attended an amazing tech conference today. So many inspiring talks and networking opportunities!',
    time: '3 days ago',
    likes: 67,
    comments: 15,
    shares: 9
  }
];

const achievements = [
  { name: 'First Post', icon: '📝', description: 'Created your first post' },
  { name: 'Popular Post', icon: '🔥', description: 'Got 100+ likes on a post' },
  { name: 'Active Member', icon: '💬', description: 'Made 50+ comments' },
  { name: 'Helper', icon: '🤝', description: 'Helped 10+ community members' }
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(user.bio);

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveBio = () => {
    // Here you would save the bio to your backend
    console.log('Saving bio:', editedBio);
    setIsEditing(false);
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

              {/* User Profile Card */}
              <div className="forum-card p-4 premium-hover">
                <div className="flex items-center space-x-3">
                  <Avatar className="avatar-forum w-12 h-12">
                    <AvatarImage src={user.profilePic} alt={user.fullName} />
                    <AvatarFallback className="gradient-primary text-primary-foreground">
                      {user.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-forum-primary">{user.fullName}</h3>
                    <p className="text-sm text-forum-secondary">{user.username}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="status-online"></div>
                      <span className="text-xs text-forum-secondary">Online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="forum-card p-4">
                <h4 className="font-semibold text-forum-primary mb-3">Quick Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-forum-secondary">Posts</span>
                    <span className="text-forum-primary font-semibold">{user.posts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forum-secondary">Followers</span>
                    <span className="text-forum-primary font-semibold">{user.followers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forum-secondary">Following</span>
                    <span className="text-forum-primary font-semibold">{user.following.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="forum-card p-4">
                <h4 className="font-semibold text-forum-primary mb-3">Achievements</h4>
                <div className="space-y-2">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-lg">{achievement.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-forum-primary">{achievement.name}</p>
                        <p className="text-xs text-forum-secondary">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
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
                  <h1 className="text-3xl font-bold text-forum-primary">Profile</h1>
                  <p className="text-forum-secondary">Manage your profile and settings</p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" className="btn-forum">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button className="btn-primary hover-glow">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Cover Photo & Profile Info */}
            <div className="forum-card overflow-hidden">
              {/* Cover Photo */}
              <div className="h-48 bg-gradient-to-r from-primary to-accent relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-6">
                  <div className="flex items-end space-x-4">
                    <Avatar className="avatar-forum w-24 h-24 border-4 border-background">
                      <AvatarImage src={user.profilePic} alt={user.fullName} />
                      <AvatarFallback className="gradient-primary text-primary-foreground text-2xl">
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-bold text-white">{user.fullName}</h2>
                        {user.verified && (
                          <Badge className="bg-primary text-primary-foreground">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-white/80">{user.username}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bio Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-forum-primary">About</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleEditProfile}
                        className="btn-forum"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-3">
                        <textarea
                          value={editedBio}
                          onChange={(e) => setEditedBio(e.target.value)}
                          className="w-full p-3 rounded-lg input-forum resize-none h-24"
                          placeholder="Tell us about yourself..."
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handleSaveBio} className="btn-primary">
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="btn-forum">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-forum-secondary leading-relaxed">{user.bio}</p>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-forum-secondary" />
                        <span className="text-forum-secondary">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-forum-secondary" />
                        <span className="text-forum-secondary">{user.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-forum-secondary" />
                        <span className="text-forum-secondary">{user.location}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-forum-secondary" />
                        <span className="text-forum-secondary">Joined {user.joinDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-forum-primary">Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted">
                        <div className="text-2xl font-bold text-forum-primary">{user.posts}</div>
                        <div className="text-sm text-forum-secondary">Posts</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted">
                        <div className="text-2xl font-bold text-forum-primary">{user.followers.toLocaleString()}</div>
                        <div className="text-sm text-forum-secondary">Followers</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted">
                        <div className="text-2xl font-bold text-forum-primary">{user.following.toLocaleString()}</div>
                        <div className="text-sm text-forum-secondary">Following</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted">
                        <div className="text-2xl font-bold text-forum-primary">98%</div>
                        <div className="text-sm text-forum-secondary">Activity</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="forum-card p-6">
              <h3 className="text-lg font-semibold text-forum-primary mb-4">Recent Posts</h3>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <p className="text-forum-primary mb-3">{post.content}</p>
                    <div className="flex items-center justify-between text-sm text-forum-secondary">
                      <span>{post.time}</span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share className="w-4 h-4" />
                          <span>{post.shares}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}