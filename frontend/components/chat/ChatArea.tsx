import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { OnlineIndicator } from '@/components/ui/online-indicator';
import { Paperclip, Image, Smile, Send, Phone, Video, Info, MoreHorizontal } from 'lucide-react';

interface ChatAreaProps {
  conversation: any;
  messages: any[];
  newMessage: string;
  setNewMessage: (msg: string) => void;
}

export default function ChatArea({ conversation, messages, newMessage, setNewMessage }: ChatAreaProps) {
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-forum-secondary">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-background/95 backdrop-blur flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Avatar className="avatar-forum w-10 h-10">
            <AvatarImage src={conversation.user.profilePic} alt={conversation.user.fullName} />
            <AvatarFallback className="gradient-primary text-primary-foreground">
              {conversation.user.fullName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-forum-primary">{conversation.user.fullName}</h3>
            <OnlineIndicator showText={true} size="sm" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {[Phone, Video, Info, MoreHorizontal].map((Icon, i) => (
            <Button key={i} variant="ghost" size="sm" className="btn-forum">
              <Icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderId === 'current'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-forum-primary'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${message.senderId === 'current' ? 'text-primary-foreground/70' : 'text-forum-secondary'}`}>
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-background/95 backdrop-blur flex items-center space-x-3">
        {[Paperclip, Image].map((Icon, i) => (
          <Button key={i} variant="ghost" size="sm" className="btn-forum">
            <Icon className="w-4 h-4" />
          </Button>
        ))}

        <div className="flex-1">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="input-forum"
          />
        </div>

        <Button variant="ghost" size="sm" className="btn-forum">
          <Smile className="w-4 h-4" />
        </Button>
        <Button onClick={handleSendMessage} className="btn-primary">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
