// backend/src/main/java/NeonSquare/backend/controllers/ChatController.java
package NeonSquare.backend.controllers;

import NeonSquare.backend.dto.ChatMessage;
import NeonSquare.backend.dto.MessageDTO;
import NeonSquare.backend.services.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate ws;
    private final ChatService chat;

    // Client SENDS to:   /app/chat/{conversationId}
    // Everyone SUBSCRIBES: /topic/chat.{conversationId}
    @MessageMapping("/chat/{conversationId}")
    public void send(@DestinationVariable String conversationId, ChatMessage msg) {
        try {
            if (conversationId == null || conversationId.isBlank()) {
                throw new IllegalArgumentException("conversationId is required");
            }
            if (msg == null) {
                throw new IllegalArgumentException("message body is required");
            }
            if (msg.getContent() == null || msg.getContent().isBlank()) {
                throw new IllegalArgumentException("content is required");
            }
            if (msg.getFromUserId() == null) {
                throw new IllegalArgumentException("fromUserId is required");
            }
            if (msg.getSentAt() == null) msg.setSentAt(LocalDateTime.now());

            UUID convId = UUID.fromString(conversationId);

            // Persist first
            MessageDTO saved = chat.saveMessage(convId, msg.getFromUserId(), msg.getContent(), msg.getSentAt());
            // Echo back the tempId (not stored) so client can replace optimistic bubble
            saved.setTempId(msg.getTempId());

            log.info("WS chat persisted: conv={} msgId={} from={} at={}",
                    convId, saved.getId(), saved.getSenderId(), saved.getSentAt());

            // Broadcast the saved message (has real id/timestamps)
            ws.convertAndSend("/topic/chat." + conversationId, saved);

        } catch (Exception e) {
            log.warn("WS chat send failed: {}", e.getMessage());
            ws.convertAndSend("/topic/chat." + conversationId, new ErrorEnvelope("CHAT_ERROR", e.getMessage()));
            throw e;
        }
    }

    @MessageExceptionHandler
    public void handleWsErrors(Exception e) {
        log.error("STOMP handler error", e);
        // Optionally: ws.convertAndSendToUser(..., "/queue/errors", e.getMessage());
    }

    // Small POJO to emit structured errors to the same topic
    public record ErrorEnvelope(String type, String message) {}
}
