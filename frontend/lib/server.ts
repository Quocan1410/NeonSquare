import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

type Message = {
  id?: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

const history: Record<string, Message[]> = {};

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

app.get('/', (_req, res) => res.send('Socket.IO server is running'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinConversation', (payload: { conversationId: string; userId?: string }) => {
    const { conversationId } = payload || {};
    if (!conversationId) return;
    socket.join(conversationId);
    io.to(conversationId).emit('presence', { type: 'joined', conversationId, userId: payload?.userId ?? '' });
  });

  socket.on('leaveConversation', (payload: { conversationId: string; userId?: string }) => {
    const { conversationId } = payload || {};
    if (!conversationId) return;
    socket.leave(conversationId);
    io.to(conversationId).emit('presence', { type: 'left', conversationId, userId: payload?.userId ?? '' });
  });

  socket.on('getHistory', (payload: { conversationId: string }, ack?: (messages: Message[]) => void) => {
    const { conversationId } = payload || {};
    if (!conversationId) return ack?.([]);
    ack?.(history[conversationId] ?? []);
  });

  socket.on('sendMessage', (message: Message) => {
    if (!message?.conversationId) return;
    const room = message.conversationId;

    history[room] = history[room] ?? [];
    history[room].push(message);
    if (history[room].length > 500) history[room].splice(0, history[room].length - 500);

    io.to(room).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});