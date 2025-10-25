'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Users, Hash, Lock, Globe, Plus, X as XIcon } from 'lucide-react';
import { addToast } from '@/components/ui/toast';
import { apiService } from '@/lib/api';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      addToast({
        type: 'error',
        title: 'Group name required',
        description: 'Please enter a group name',
      });
      return;
    }

    try {
      // Get current user ID from auth context
      const userId = localStorage.getItem('user_id'); // This should come from auth context
      if (!userId) {
        addToast({
          type: 'error',
          title: 'Authentication required',
          description: 'Please log in to create a group',
        });
        return;
      }

      // Call API to create group
      await apiService.createGroup(groupName, description, privacy.toUpperCase(), userId);
      
      addToast({
        type: 'success',
        title: 'Group created successfully!',
        description: `"${groupName}" is now ready for members`,
      });
      
      // Reset form
      setGroupName('');
      setDescription('');
      setPrivacy('public');
      setTags([]);
      setTagInput('');
      onClose();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to create group',
        description: 'Please try again later',
      });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="modal-overlay fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="modal-content bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="w-6 h-6 mr-2 text-primary" />
              Create Group
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Group Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name *
              </label>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this group about?"
                rows={3}
                className="w-full"
              />
            </div>

            {/* Privacy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Privacy
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    value="public"
                    checked={privacy === 'public'}
                    onChange={(e) => setPrivacy(e.target.value as 'public' | 'private')}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Public</p>
                      <p className="text-sm text-gray-600">Anyone can find and join</p>
                    </div>
                  </div>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    value="private"
                    checked={privacy === 'private'}
                    onChange={(e) => setPrivacy(e.target.value as 'public' | 'private')}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">Private</p>
                      <p className="text-sm text-gray-600">Invite only</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add tags..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      className="bg-primary/10 text-primary border-primary/20 flex items-center space-x-1"
                    >
                      <Hash className="w-3 h-3" />
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
              >
                Create Group
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
