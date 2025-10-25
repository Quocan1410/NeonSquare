import { io, Socket } from 'socket.io-client';

export type Message = {
  id?: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

interface ServerToClientEvents {
  receiveMessage: (message: Message) => void;
  presence: (payload: { type: 'joined' | 'left'; conversationId: string; userId: string }) => void;
}

interface ClientToServerEvents {
  joinConversation: (payload: { conversationId: string; userId?: string }) => void;
  leaveConversation: (payload: { conversationId: string; userId?: string }) => void;
  getHistory: (payload: { conversationId: string }, ack?: (messages: Message[]) => void) => void;
  sendMessage: (message: Message) => void;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_URL, {
  autoConnect: true,
});

export function joinConversation(conversationId: string, userId?: string) {
  socket.emit('joinConversation', { conversationId, userId });
}
export function leaveConversation(conversationId: string, userId?: string) {
  socket.emit('leaveConversation', { conversationId, userId });
}
export function getHistory(conversationId: string, cb: (messages: Message[]) => void) {
  socket.emit('getHistory', { conversationId }, cb);
}
export function sendMessage(message: Message) {
  socket.emit('sendMessage', message);
}