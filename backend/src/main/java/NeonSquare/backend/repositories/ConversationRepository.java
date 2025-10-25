// NeonSquare/backend/src/main/java/NeonSquare/backend/repositories/ConversationRepository.java
package NeonSquare.backend.repositories;

import NeonSquare.backend.models.Conversation;
import NeonSquare.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    // stored with sorted pairs (minId, maxId), see service for normalization
    Optional<Conversation> findByUserA_IdAndUserB_Id(UUID userAId, UUID userBId);

    List<Conversation> findByUserA_IdOrUserB_IdOrderByCreatedAtDesc(UUID userIdA, UUID userIdB);
}
