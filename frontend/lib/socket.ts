import { io, Socket } from 'socket.io-client';
import { Message } from '@/types';

interface ServerToClientEvents {
  receiveMessage: (message: Message) => void;
}

interface ClientToServerEvents {
  sendMessage: (message: Message) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3001', {
  autoConnect: true,
});
