// frontend/lib/notifications.ts
import { Client, IMessage } from '@stomp/stompjs';

export function connectNotifications(
  userId: string,
  onMessage: (data: any) => void
): () => void {
  const httpBase = process.env.NEXT_PUBLIC_API_URL!; // e.g. http://localhost:8080/api
  const wsBase = httpBase.replace('/api', '').replace(/^http/, 'ws'); // -> ws://localhost:8080

  const client = new Client({
    brokerURL: `${wsBase}/ws`,
    reconnectDelay: 5000,
    // debug: (str) => console.log('[STOMP]', str),
  });

  client.onConnect = () => {
    client.subscribe(`/topic/user.${userId}`, (msg: IMessage) => {
      try {
        onMessage(JSON.parse(msg.body));
      } catch {
        onMessage(msg.body);
      }
    });
  };

  client.activate();

  // Cleanup must be void (not Promise)
  return () => {
    // ignore the returned Promise to satisfy React types
    void client.deactivate();
  };
}
