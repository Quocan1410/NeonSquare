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
@Table(
    name = "notification",
    indexes = {
        @Index(name = "idx_notification_user_id", columnList = "user_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Notification {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false) // <- many notifications can point to the same user
    @ToString.Exclude
    private User user;

    @Column(name = "create_date", nullable = false)
    private LocalDateTime createDate;

    @Enumerated(EnumType.ORDINAL) // matches smallint/int2 column
    @Column(nullable = false)
    private NotificationStatus status;

    @Column(columnDefinition = "text", nullable = false)
    private String content;

    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private NotificationType type;

    @PrePersist
    void prePersist() {
        if (createDate == null) {
            createDate = LocalDateTime.now();
        }
        if (status == null) {
            status = NotificationStatus.New;
        }
    }
}
