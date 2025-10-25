// NeonSquare/backend/src/main/java/NeonSquare/backend/dto/MessageDTO.java  
package NeonSquare.backend.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MessageDTO {
    private UUID id;
    private UUID conversationId;
    private UUID senderId;
    private String content;
    private LocalDateTime sentAt;
    private boolean read;

    // NEW: not stored in DB, just echoed so client can replace optimistic message
    private String tempId;
}
