'use client';

import { useState, useEffect } from 'react';
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
  ArrowLeft,
  Save,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';


export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form data when canceling edit
      if (user) {
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || ''
        });
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await apiService.updateUser(user.id, formData);
      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen forum-layout flex items-center justify-center">
        <div className="text-forum-secondary">Loading profile...</div>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const username = `@${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}`;

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
                    <AvatarImage src={user.profilePicUrl} alt={fullName} />
                    <AvatarFallback className="gradient-primary text-primary-foreground">
                      {fullName.split(' ').map(n => n[0]).join('')}
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
                  <Button 
                    onClick={handleEditProfile}
                    className="btn-primary hover-glow"
                    disabled={isLoading}
                  >
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
                    <Button 
                      onClick={handleSaveProfile}
                      className="btn-primary hover-glow"
                      disabled={isLoading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
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
                      <AvatarImage src={user.profilePicUrl} alt={fullName} />
                      <AvatarFallback className="gradient-primary text-primary-foreground text-2xl">
                        {fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-bold text-white">{fullName}</h2>
                        {user.status === 'ACTIVE' && (
                          <Badge className="bg-primary text-primary-foreground">
                            ✓ Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-white/80">{username}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6">
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-forum-primary">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-forum-primary mb-2">First Name</label>
                        {isEditing ? (
                          <Input
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="input-forum"
                            placeholder="Enter first name"
                          />
                        ) : (
                          <p className="text-forum-secondary p-2 bg-muted rounded-lg">{user.firstName || 'Not set'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-forum-primary mb-2">Last Name</label>
                        {isEditing ? (
                          <Input
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="input-forum"
                            placeholder="Enter last name"
                          />
                        ) : (
                          <p className="text-forum-secondary p-2 bg-muted rounded-lg">{user.lastName || 'Not set'}</p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-forum-primary mb-2">Email</label>
                        {isEditing ? (
                          <Input
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="input-forum"
                            placeholder="Enter email"
                            type="email"
                          />
                        ) : (
                          <p className="text-forum-secondary p-2 bg-muted rounded-lg">{user.email || 'Not set'}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-forum-primary">Account Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="w-4 h-4 text-forum-secondary" />
                        <span className="text-forum-secondary">Status: {user.status || 'Active'}</span>
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