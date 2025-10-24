package NeonSquare.backend.models;

import NeonSquare.backend.models.enums.NotificationStatus;
import NeonSquare.backend.models.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.util.UUID;

@Entity
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

    @OneToOne
    private User user;

    private LocalDate createDate;

    @Enumerated(EnumType.ORDINAL)
    private NotificationStatus status;

    private String content;

    @Enumerated(EnumType.ORDINAL)
    private NotificationType type;

}
