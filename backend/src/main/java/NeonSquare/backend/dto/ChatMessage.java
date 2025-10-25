// NeonSquare/backend/src/main/java/NeonSquare/backend/dto/ChatMessage.java
package NeonSquare.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class ChatMessage {
    private UUID fromUserId;
    private UUID toUserId;
    private String content;
    private LocalDateTime sentAt;

    // NEW: correlate echo with optimistic client message
    private String tempId;
}
