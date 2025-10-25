// backend/src/main/java/NeonSquare/backend/controllers/ChatRestController.java
package NeonSquare.backend.controllers;

import NeonSquare.backend.dto.ConversationDTO;
import NeonSquare.backend.dto.MessageDTO;
import NeonSquare.backend.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final ChatService chat;
    private final SimpMessagingTemplate ws;

    // POST /api/chat/conversations?user1=&user2=  -> returns existing or creates new
    @PostMapping("/conversations")
    public ConversationDTO getOrCreate(@RequestParam UUID user1, @RequestParam UUID user2) {
        return chat.getOrCreateConversation(user1, user2);
    }

    // GET /api/chat/conversations/{userId}
    @GetMapping("/conversations/{userId}")
    public List<ConversationDTO> list(@PathVariable UUID userId) {
        return chat.listForUser(userId);
    }

    // GET /api/chat/{conversationId}/messages?page=0&size=30
    @GetMapping("/{conversationId}/messages")
    public List<MessageDTO> listMessages(@PathVariable UUID conversationId,
                                         @RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "30") int size) {
        return chat.listRecent(conversationId, page, size);
    }

    // POST /api/chat/{conversationId}/messages  (handy for CLI tests)
    @PostMapping("/{conversationId}/messages")
    public MessageDTO postMessage(@PathVariable UUID conversationId,
                                  @RequestParam UUID senderId,
                                  @RequestParam String content) {
        MessageDTO saved = chat.saveMessage(conversationId, senderId, content, LocalDateTime.now());
        // Broadcast to WS subscribers as well
        ws.convertAndSend("/topic/chat." + conversationId, saved);
        return saved;
    }

    // POST /api/chat/{conversationId}/read?userId=
    @PostMapping("/{conversationId}/read")
    public ResponseEntity<Integer> markRead(@PathVariable UUID conversationId,
                                            @RequestParam UUID userId) {
        return ResponseEntity.ok(chat.markRead(conversationId, userId));
    }
}
