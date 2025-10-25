// NeonSquare/backend/src/main/java/NeonSquare/backend/repositories/ChatMessageRepository.java
package NeonSquare.backend.repositories;

import NeonSquare.backend.models.ChatMessageEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, UUID> {
    List<ChatMessageEntity> findByConversation_IdOrderBySentAtDesc(UUID conversationId, Pageable pageable);
    long countByConversation_IdAndReadFalseAndSender_IdNot(UUID conversationId, UUID excludeSenderId);
}
