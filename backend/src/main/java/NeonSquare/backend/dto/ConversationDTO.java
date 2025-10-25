// NeonSquare/backend/src/main/java/NeonSquare/backend/dto/ConversationDTO.java
package NeonSquare.backend.dto;

import lombok.*;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ConversationDTO {
    private UUID id;
    private UUID userAId;
    private UUID userBId;
}
