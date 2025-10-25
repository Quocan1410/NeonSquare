// NeonSquare/frontend/app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User as UserIcon,
  Edit,
  Settings,
  ArrowLeft,
  Save,
  Loader2,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';
import AddFriendButton from '@/components/friends/AddFriendButton';

export default function ProfilePage() {
  const { user: authUser, refreshUser } = useAuth();
  const [viewUserId, setViewUserId] = useState<string | null>(null);
  const [viewUser, setViewUser] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });

  // Resolve userId from query string without useSearchParams (avoids Suspense requirement)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get('userId');
    setViewUserId(q);
  }, []);

  // Load the profile to view
  useEffect(() => {
    const load = async () => {
      if (!authUser) return;
      const isOwn = !viewUserId || viewUserId === authUser.id;
      if (isOwn) {
        setViewUser(authUser);
        setFormData({
          firstName: authUser.firstName || '',
          lastName: authUser.lastName || '',
          email: authUser.email || ''
        });
      } else {
        try {
          const u = await apiService.getUser(viewUserId!);
          setViewUser(u);
        } catch (e) {
          console.error('Failed to load user', e);
          setViewUser(null);
        }
      }
    };
    load();
  }, [authUser, viewUserId]);

  useEffect(() => {
    if (viewUser && (!viewUserId || viewUserId === viewUser.id)) {
      setFormData({
        firstName: viewUser.firstName || '',
        lastName: viewUser.lastName || '',
        email: viewUser.email || ''
      });
    }
  }, [viewUser, viewUserId]);

  const isOwnProfile = !!authUser && !!viewUser && authUser.id === viewUser.id;

  const handleEditProfile = () => {
    if (!isOwnProfile) return;
    setIsEditing(!isEditing);
    if (!isEditing && viewUser) {
      setFormData({
        firstName: viewUser.firstName || '',
        lastName: viewUser.lastName || '',
        email: viewUser.email || ''
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!isOwnProfile) return;
    setIsLoading(true);
    try {
      await apiService.updateUser(authUser!.id, formData);
      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!isOwnProfile) return;
    try {
      await apiService.uploadProfilePic(authUser!.id, file);
      await refreshUser();
    } catch (err) {
      console.error('Avatar upload failed', err);
    }
  };

  if (!authUser || !viewUser) {
    return (
      <div className="min-h-screen forum-layout flex items-center justify-center">
        <div className="text-forum-secondary">Loading profile...</div>
      </div>
    );
  }

  const fullName = `${viewUser.firstName ?? ''} ${viewUser.lastName ?? ''}`.trim() || 'User';
  const initials = `${(viewUser.firstName ?? '').charAt(0)}${(viewUser.lastName ?? '').charAt(0)}` || 'U';
  const username = `@${(viewUser.firstName || '').toLowerCase()}${(viewUser.lastName || '').toLowerCase()}`;

  return (
    <div className="min-h-screen forum-layout">
      <div className="flex">
        {/* Sidebar */}
        <div className="forum-sidebar scrollbar-forum">
          <div className="flex flex-col h-full">
            <div className="p-6 space-y-6 flex-1">
              <Link href="/dashboard" className="flex items-center text-forum-secondary hover:text-forum-primary transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>

              <div className="forum-card p-4 premium-hover">
                <div className="flex items-center space-x-3">
                  <Avatar className="avatar-forum w-12 h-12">
                    <AvatarImage src={viewUser.profilePicUrl} alt={fullName} />
                    <AvatarFallback className="gradient-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-forum-primary">{fullName}</h3>
                    <p className="text-sm text-forum-secondary">{username}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="status-online"></div>
                      <span className="text-xs text-forum-secondary">Online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions for other people's profile */}
              {!isOwnProfile && (
                <div className="space-y-2">
                  <AddFriendButton meId={authUser.id} otherId={viewUser.id} className="w-full" />
                  <Button variant="outline" className="w-full btn-forum">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              )}
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
                  <p className="text-forum-secondary">
                    {isOwnProfile ? 'Manage your profile and settings' : 'User information'}
                  </p>
                </div>

                {isOwnProfile && (
                  <div className="flex space-x-3">
                    <Button onClick={handleEditProfile} className="btn-primary hover-glow" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : isEditing ? (
                        <>
                          <Settings className="w-4 h-4 mr-2" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                    {isEditing && (
                      <Button onClick={handleSaveProfile} className="btn-primary hover-glow" disabled={isLoading}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Cover + Info */}
            <div className="forum-card overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-primary to-accent relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-6">
                  <div className="flex items-end space-x-4">
                    <Avatar className="avatar-forum w-24 h-24 border-4 border-background">
                      <AvatarImage src={viewUser.profilePicUrl} alt={fullName} />
                      <AvatarFallback className="gradient-primary text-primary-foreground text-2xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-bold text-white">{fullName}</h2>
                        {viewUser.status === 'ACTIVE' && (
                          <Badge className="bg-primary text-primary-foreground">✓ Active</Badge>
                        )}
                      </div>
                      <p className="text-white/80">{username}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-forum-primary">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-forum-primary mb-2">First Name</label>
                        {isOwnProfile && isEditing ? (
                          <Input
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="input-forum"
                            placeholder="Enter first name"
                          />
                        ) : (
                          <p className="text-forum-secondary p-2 bg-muted rounded-lg">{viewUser.firstName || 'Not set'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-forum-primary mb-2">Last Name</label>
                        {isOwnProfile && isEditing ? (
                          <Input
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="input-forum"
                            placeholder="Enter last name"
                          />
                        ) : (
                          <p className="text-forum-secondary p-2 bg-muted rounded-lg">{viewUser.lastName || 'Not set'}</p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-forum-primary mb-2">Email</label>
                        {isOwnProfile && isEditing ? (
                          <Input
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="input-forum"
                            placeholder="Enter email"
                            type="email"
                          />
                        ) : (
                          <p className="text-forum-secondary p-2 bg-muted rounded-lg">{viewUser.email || 'Not set'}</p>
                        )}
                      </div>

                      {/* Avatar upload (owner only) */}
                      {isOwnProfile && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-forum-primary mb-2">Profile Picture</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleAvatarUpload(file);
                            }}
                            className="block w-full text-sm text-forum-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-muted file:text-forum-primary hover:file:bg-muted/80"
                          />
                          <p className="text-xs text-forum-secondary mt-1">PNG/JPG, a few MB max.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-forum-primary">Account Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <UserIcon className="w-4 h-4 text-forum-secondary" />
                        <span className="text-forum-secondary">Status: {viewUser.status || 'Active'}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
