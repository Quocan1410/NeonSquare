'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ImageIcon, Smile, X, Globe, Users, Lock, Loader2 } from 'lucide-react';
import { addToast } from '@/components/ui/toast';

export function CreatePost() {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = {
    fullName: 'John Doe',
    profilePic: '/avatar.jpg',
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      addToast({
        type: 'warning',
        title: 'Content required',
        description: 'Please write something before posting.'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would submit the post to your backend
      console.log('Creating post:', { content, visibility, image: imagePreview });
      
      // Success feedback
      addToast({
        type: 'success',
        title: 'Post published!',
        description: 'Your post has been shared with the community.'
      });
      
      // Reset form
      setContent('');
      setImagePreview(null);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to post',
        description: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVisibilityIcon = (vis: string) => {
    switch (vis) {
      case 'public':
        return <Globe className="w-4 h-4" />;
      case 'friends':
        return <Users className="w-4 h-4" />;
      case 'private':
        return <Lock className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="forum-card p-6 premium-hover">
      <div className="flex items-start space-x-4">
        <Avatar className="avatar-forum w-10 h-10">
          <AvatarImage src={user.profilePic} alt={user.fullName} />
          <AvatarFallback className="gradient-primary text-primary-foreground">
            {user.fullName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-4">
          <textarea
            placeholder="What's on your mind?"
            className="w-full p-4 rounded-xl input-forum resize-none min-h-[100px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          {imagePreview && (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-xl border border-border"
              />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <label className="flex items-center px-3 py-2 rounded-lg btn-forum cursor-pointer premium-hover">
                <ImageIcon className="w-4 h-4 mr-2" />
                Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <button className="flex items-center px-3 py-2 rounded-lg btn-forum premium-hover">
                <Smile className="w-4 h-4 mr-2" />
                Emoji
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <select 
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as 'public' | 'friends' | 'private')}
                className="px-3 py-2 rounded-lg input-forum"
              >
                <option value="public">Public</option>
                <option value="friends">Friends</option>
                <option value="private">Private</option>
              </select>
              <Button 
                className="btn-primary hover-glow shadow-fresh px-6 animate-fresh-glow"
                disabled={!content.trim() || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}