'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Edit, Share, MessageCircle } from 'lucide-react';

export default function ProfilePage() {
  const user = {
    fullName: 'John Doe',
    profilePic: '/avatar.jpg',
    role: 'Grade 12 Student',
    bio: 'Passionate about learning and connecting with fellow students. Love sharing knowledge and helping others succeed.',
    location: 'Ho Chi Minh City, Vietnam',
    joinDate: 'January 2024',
    posts: 24,
    friends: 156,
    likes: 1200
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Header */}
        <Card className="card-social">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="avatar-forum online w-20 h-20">
                  <AvatarImage src={user.profilePic} alt={user.fullName} />
                  <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                    {user.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{user.fullName}</h1>
                  <p className="text-muted-foreground">{user.role}</p>
                  <p className="text-sm text-muted-foreground">{user.location}</p>
                  <p className="text-xs text-muted-foreground">Joined {user.joinDate}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground mb-4">{user.bio}</p>
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user.posts}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{user.friends}</div>
                <div className="text-sm text-muted-foreground">Friends</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user.likes}</div>
                <div className="text-sm text-muted-foreground">Likes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Posts */}
          <div className="md:col-span-2">
            <Card className="card-social">
              <CardHeader>
                <h2 className="text-xl font-semibold text-foreground">Recent Posts</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-foreground">Math exam today was so hard! Does anyone have study tips?</p>
                    <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                      <span>2 hours ago</span>
                      <div className="flex space-x-4">
                        <span>12 likes</span>
                        <span>5 comments</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-foreground">Sharing Physics study materials for Grade 12 students. Check the link in comments!</p>
                    <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                      <span>1 day ago</span>
                      <div className="flex space-x-4">
                        <span>25 likes</span>
                        <span>12 comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Friends */}
            <Card className="card-social">
              <CardHeader>
                <h3 className="text-lg font-semibold text-foreground">Friends</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="avatar-forum w-8 h-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">Jane Smith</p>
                      <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar className="avatar-forum w-8 h-8">
                      <AvatarFallback className="bg-accent/20 text-accent text-xs font-semibold">MJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">Mike Johnson</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card className="card-social">
              <CardHeader>
                <h3 className="text-lg font-semibold text-foreground">Interests</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge className="badge-social">Mathematics</Badge>
                  <Badge className="badge-social">Physics</Badge>
                  <Badge className="badge-social">Programming</Badge>
                  <Badge className="badge-social">Science</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
