// frontend/lib/socket.ts
import { Client, IMessage, IFrame, StompSubscription } from '@stomp/stompjs';
export type { ChatMessage } from '@/types';

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL?.trim() ||
  'ws://localhost:8080/ws'; // Spring STOMP endpoint

const client = new Client({
  brokerURL: WS_URL,
  reconnectDelay: 3000,
  heartbeatIncoming: 10000,
  heartbeatOutgoing: 10000,
  debug: (msg) => {
    if (process.env.NODE_ENV !== 'production') {
      // console.log('[STOMP]', msg);
    }
  },
});

client.onStompError = (frame) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[STOMP ERROR]', frame.headers['message'], frame.body);
  }
};

export function getStomp(): Client {
  if (!client.active) client.activate();
  return client;
}

export function startWs() {
  if (!client.active) client.activate();
}

/** One-shot waiter that does not permanently replace onConnect */
export function ensureConnected(): Promise<void> {
  if (client.connected) return Promise.resolve();
  if (!client.active) client.activate();

  return new Promise<void>((resolve) => {
    const prev = client.onConnect;
    client.onConnect = (frame: IFrame) => {
      try { prev?.(frame); } catch {}
      client.onConnect = prev; // restore
      resolve();
    };
  });
}

export function subscribeChat(
  conversationId: string,
  handler: (msg: import('@/types').ChatMessage) => void
) {
  let sub: StompSubscription | null = null;
  let cancelled = false;

  ensureConnected()
    .then(() => {
      if (cancelled) return;
      sub = client.subscribe(`/topic/chat.${conversationId}`, (frame: IMessage) => {
        try {
          handler(JSON.parse(frame.body));
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Failed to parse chat frame', e);
          }
        }
      });
    })
    .catch(() => {});

  return () => {
    cancelled = true;
    try { sub?.unsubscribe(); } catch {}
  };
}

export async function sendChat(conversationId: string, msg: import('@/types').ChatMessage) {
  await ensureConnected();
  client.publish({
    destination: `/app/chat/${conversationId}`,
    body: JSON.stringify(msg),
  });
}
