// backend/src/main/java/NeonSquare/backend/dto/NotificationDTO.java
package NeonSquare.backend.dto;

import NeonSquare.backend.models.enums.NotificationStatus;
import NeonSquare.backend.models.enums.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class NotificationDTO {
    private UUID id;
    private UUID userId;
    private String content;
    private NotificationType type;
    private NotificationStatus status;
    private LocalDateTime createDate;
}
