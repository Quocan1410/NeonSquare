// frontend/hooks/useChat.ts
import { useEffect, useRef } from "react";
import { getStomp, ensureConnected } from "@/lib/socket";
import type { ChatMessage } from "@/types";
import type { IMessage } from "@stomp/stompjs";

export function useChat(conversationId: string, onIncoming?: (m: ChatMessage) => void) {
  const stompRef = useRef(getStomp());

  useEffect(() => {
    const stomp = stompRef.current;
    if (!conversationId) return;

    let unsub: (() => void) | undefined;
    let cancelled = false;

    const doSub = async () => {
      try {
        await ensureConnected();
        if (cancelled) return;
        const sub = stomp.subscribe(`/topic/chat.${conversationId}`, (msg: IMessage) => {
          try { onIncoming?.(JSON.parse(msg.body) as ChatMessage); } catch {}
        });
        unsub = () => { try { sub?.unsubscribe(); } catch {} };
      } catch {}
    };

    void doSub();
    return () => { cancelled = true; try { unsub?.(); } catch {} };
  }, [conversationId, onIncoming]);

  async function send(senderId: string, toUserId: string | undefined, content: string, tempId?: string) {
    const payload: ChatMessage = {
      conversationId,
      fromUserId: senderId,
      toUserId,
      content,
      sentAt: new Date().toISOString(),
      tempId,
    };
    await ensureConnected();
    stompRef.current.publish({
      destination: `/app/chat/${conversationId}`,
      body: JSON.stringify(payload),
    });
  }

  return { send };
}
