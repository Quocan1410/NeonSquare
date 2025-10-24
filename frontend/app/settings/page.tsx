'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FormField, FormGroup, FormSection, useFormValidation, validators } from '@/components/ui/form';
import { addToast, ToastContainer } from '@/components/ui/toast';
import { showConfirmationDialog, ConfirmationDialogContainer } from '@/components/ui/confirmation-dialog';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Upload,
  Trash2,
  Download,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

const user = {
  fullName: 'John Doe',
  username: '@johndoe',
  email: 'john.doe@example.com',
  profilePic: '/avatars/user.png',
  joinDate: 'January 2023'
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form validation for profile
  const profileForm = useFormValidation(
    {
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      bio: ''
    },
    {
      fullName: [validators.required, validators.minLength(2)],
      username: [validators.required, validators.username],
      email: [validators.required, validators.email],
      bio: [validators.maxLength(500)]
    }
  );
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    mentions: true,
    comments: true,
    likes: false,
    follows: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    allowComments: true
  });
  const [theme, setTheme] = useState({
    mode: 'dark',
    accent: 'teal',
    fontSize: 'medium'
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'account', label: 'Account', icon: Lock }
  ];

  const handleSave = async () => {
    if (activeTab === 'profile' && !profileForm.validateAll()) {
      addToast({
        type: 'error',
        title: 'Validation failed',
        description: 'Please fix the errors before saving.'
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving settings...');
      // Here you would save settings to your backend
      
      addToast({
        type: 'success',
        title: 'Settings saved!',
        description: 'Your changes have been saved successfully.'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to save',
        description: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    console.log('Exporting data...');
    // Here you would export user data
  };

  const handleDeleteAccount = () => {
    showConfirmationDialog({
      title: 'Delete Account',
      description: 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.',
      type: 'danger',
      confirmText: 'Delete Account',
      cancelText: 'Cancel',
      onConfirm: () => {
        console.log('Deleting account...');
        // Here you would delete the account
        addToast({
          type: 'success',
          title: 'Account deleted',
          description: 'Your account has been permanently deleted.'
        });
      }
    });
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

              {/* User Info */}
              <div className="forum-card p-4">
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
                  </div>
                  </div>
                </div>

              {/* Settings Tabs */}
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-forum-secondary hover:text-forum-primary hover:bg-muted/50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
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
                  <h1 className="text-3xl font-bold text-forum-primary">Settings</h1>
                  <p className="text-forum-secondary">Manage your account and preferences</p>
                </div>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="btn-primary hover-glow"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                    </>
                  )}
                </Button>
              </div>
                </div>

            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="forum-card p-6">
                  <h3 className="text-lg font-semibold text-forum-primary mb-4">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormGroup>
                      <FormField 
                        label="Full Name" 
                        required 
                        error={profileForm.errors.fullName}
                      >
                        <Input
                          value={profileForm.values.fullName}
                          onChange={(e) => profileForm.setValue('fullName', e.target.value)}
                          onBlur={() => profileForm.setFieldTouched('fullName')}
                          className="input-forum"
                        />
                      </FormField>
                      
                      <FormField 
                        label="Username" 
                        required 
                        error={profileForm.errors.username}
                      >
                        <Input
                          value={profileForm.values.username}
                          onChange={(e) => profileForm.setValue('username', e.target.value)}
                          onBlur={() => profileForm.setFieldTouched('username')}
                          className="input-forum"
                        />
                      </FormField>
                      
                      <FormField 
                        label="Email" 
                        required 
                        error={profileForm.errors.email}
                      >
                        <Input
                          type="email"
                          value={profileForm.values.email}
                          onChange={(e) => profileForm.setValue('email', e.target.value)}
                          onBlur={() => profileForm.setFieldTouched('email')}
                          className="input-forum"
                        />
                      </FormField>
                    </FormGroup>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-forum-primary">Profile Picture</Label>
                        <div className="flex items-center space-x-4 mt-2">
                          <Avatar className="avatar-forum w-16 h-16">
                            <AvatarImage src={user.profilePic} alt={user.fullName} />
                            <AvatarFallback className="gradient-primary text-primary-foreground">
                              {user.fullName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <Button variant="outline" className="btn-forum">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload New
                          </Button>
                        </div>
                      </div>
                  <div>
                        <Label htmlFor="bio" className="text-forum-primary">Bio</Label>
                        <Textarea
                    id="bio" 
                          placeholder="Tell us about yourself..."
                          className="input-forum mt-1"
                          rows={4}
                  />
                </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="forum-card p-6">
                  <h3 className="text-lg font-semibold text-forum-primary mb-4">Notification Preferences</h3>
                  <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                        <h4 className="font-medium text-forum-primary">Email Notifications</h4>
                        <p className="text-sm text-forum-secondary">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                        <h4 className="font-medium text-forum-primary">Push Notifications</h4>
                        <p className="text-sm text-forum-secondary">Receive push notifications on your device</p>
                  </div>
                  <Switch 
                    checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                        <h4 className="font-medium text-forum-primary">SMS Notifications</h4>
                        <p className="text-sm text-forum-secondary">Receive notifications via SMS</p>
                  </div>
                  <Switch 
                    checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                      />
                    </div>
                    <div className="border-t border-border pt-6">
                      <h4 className="font-medium text-forum-primary mb-4">What to notify me about</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-forum-primary">Mentions</h5>
                            <p className="text-sm text-forum-secondary">When someone mentions you</p>
                          </div>
                          <Switch
                            checked={notifications.mentions}
                            onCheckedChange={(checked) => setNotifications({...notifications, mentions: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-forum-primary">Comments</h5>
                            <p className="text-sm text-forum-secondary">When someone comments on your posts</p>
                          </div>
                          <Switch
                            checked={notifications.comments}
                            onCheckedChange={(checked) => setNotifications({...notifications, comments: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-forum-primary">Likes</h5>
                            <p className="text-sm text-forum-secondary">When someone likes your posts</p>
                          </div>
                          <Switch
                            checked={notifications.likes}
                            onCheckedChange={(checked) => setNotifications({...notifications, likes: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-forum-primary">New Followers</h5>
                            <p className="text-sm text-forum-secondary">When someone follows you</p>
                          </div>
                          <Switch
                            checked={notifications.follows}
                            onCheckedChange={(checked) => setNotifications({...notifications, follows: checked})}
                  />
                </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="forum-card p-6">
                  <h3 className="text-lg font-semibold text-forum-primary mb-4">Privacy & Security</h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="profileVisibility" className="text-forum-primary">Profile Visibility</Label>
                      <Select value={privacy.profileVisibility} onValueChange={(value) => setPrivacy({...privacy, profileVisibility: value})}>
                        <SelectTrigger className="input-forum mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-forum-primary">Show Email</h4>
                          <p className="text-sm text-forum-secondary">Make your email visible to other users</p>
                        </div>
                        <Switch
                          checked={privacy.showEmail}
                          onCheckedChange={(checked) => setPrivacy({...privacy, showEmail: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-forum-primary">Show Phone</h4>
                          <p className="text-sm text-forum-secondary">Make your phone number visible to other users</p>
                        </div>
                        <Switch
                          checked={privacy.showPhone}
                          onCheckedChange={(checked) => setPrivacy({...privacy, showPhone: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-forum-primary">Allow Messages</h4>
                          <p className="text-sm text-forum-secondary">Allow other users to send you messages</p>
                </div>
                        <Switch
                          checked={privacy.allowMessages}
                          onCheckedChange={(checked) => setPrivacy({...privacy, allowMessages: checked})}
                        />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                          <h4 className="font-medium text-forum-primary">Allow Comments</h4>
                          <p className="text-sm text-forum-secondary">Allow comments on your posts</p>
                  </div>
                  <Switch 
                          checked={privacy.allowComments}
                          onCheckedChange={(checked) => setPrivacy({...privacy, allowComments: checked})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="forum-card p-6">
                  <h3 className="text-lg font-semibold text-forum-primary mb-4">Appearance</h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="theme" className="text-forum-primary">Theme</Label>
                      <Select value={theme.mode} onValueChange={(value) => setTheme({...theme, mode: value})}>
                        <SelectTrigger className="input-forum mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="accent" className="text-forum-primary">Accent Color</Label>
                      <Select value={theme.accent} onValueChange={(value) => setTheme({...theme, accent: value})}>
                        <SelectTrigger className="input-forum mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="teal">Teal</SelectItem>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fontSize" className="text-forum-primary">Font Size</Label>
                      <Select value={theme.fontSize} onValueChange={(value) => setTheme({...theme, fontSize: value})}>
                        <SelectTrigger className="input-forum mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="forum-card p-6">
                  <h3 className="text-lg font-semibold text-forum-primary mb-4">Account Security</h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="currentPassword" className="text-forum-primary">Current Password</Label>
                      <div className="relative mt-1">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          className="input-forum pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="newPassword" className="text-forum-primary">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        className="input-forum mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-forum-primary">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="input-forum mt-1"
                  />
                </div>
                    <Button className="btn-primary">
                      <Lock className="w-4 h-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                </div>

                <div className="forum-card p-6">
                  <h3 className="text-lg font-semibold text-forum-primary mb-4">Data & Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-forum-primary">Export Data</h4>
                        <p className="text-sm text-forum-secondary">Download a copy of your data</p>
                      </div>
                      <Button variant="outline" onClick={handleExportData} className="btn-forum">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div>
                          <h4 className="font-medium text-destructive">Delete Account</h4>
                          <p className="text-sm text-forum-secondary">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
          </div>
        </div>
      </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Toast and Dialog Containers */}
      <ToastContainer />
      <ConfirmationDialogContainer />
    </div>
  );
}
