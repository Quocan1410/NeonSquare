// backend/src/main/java/NeonSquare/backend/models/Notification.java
package NeonSquare.backend.models;

import NeonSquare.backend.models.enums.NotificationStatus;
import NeonSquare.backend.models.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString
public class Notification {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private User user;

    @Column(name = "create_date")
    private LocalDateTime createDate;

    @Enumerated(EnumType.ORDINAL) // matches your smallint (int2) column
    private NotificationStatus status;

    @Column(columnDefinition = "text")
    private String content;

    @Enumerated(EnumType.ORDINAL)
    private NotificationType type;
}
