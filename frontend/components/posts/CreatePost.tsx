'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ImageIcon, Smile, X, Globe, Users, Lock } from 'lucide-react';

export function CreatePost() {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleSubmit = () => {
    if (content.trim()) {
      console.log('Creating post:', { content, visibility, image: imagePreview });
      setContent('');
      setImagePreview(null);
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
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-start space-x-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user.profilePic} alt={user.fullName} />
          <AvatarFallback className="bg-primary text-white">
            {user.fullName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-4">
          <textarea
            placeholder="What's on your mind?"
            className="w-full p-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none min-h-[100px]"
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
              <label className="flex items-center px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer transition-colors">
                <ImageIcon className="w-4 h-4 mr-2" />
                Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <button className="flex items-center px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                <Smile className="w-4 h-4 mr-2" />
                Emoji
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <select 
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as 'public' | 'friends' | 'private')}
                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="public">Public</option>
                <option value="friends">Friends</option>
                <option value="private">Private</option>
              </select>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white px-6"
                disabled={!content.trim()}
                onClick={handleSubmit}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}