// NeonSquare/backend/src/main/java/NeonSquare/backend/models/ChatMessageEntity.java
package NeonSquare.backend.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chat_message", indexes = {
        @Index(name = "idx_chat_message_conversation", columnList = "conversation_id, sent_at DESC")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatMessageEntity {

    @Id @GeneratedValue @UuidGenerator
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(columnDefinition = "text", nullable = false)
    private String content;

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;

    @Column(name = "is_read", nullable = false)
    private boolean read;

    @PrePersist
    void pre() { if (sentAt == null) sentAt = LocalDateTime.now(); }
}
