package NeonSquare.backend.repositories;

import NeonSquare.backend.models.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, UUID> {
    @Query(value = """
    SELECT r.* FROM reaction r
    JOIN reaction_post rp ON r.id = rp.reaction_id
    WHERE rp.post_id = :postId AND r.user_id = :userId
    """, nativeQuery = true)
    Reaction findReactionByUserAndPost(UUID userId, UUID postId);
}
