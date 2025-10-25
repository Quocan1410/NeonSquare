// backend/src/main/java/NeonSquare/backend/repositories/ReactionRepository.java
package NeonSquare.backend.repositories;

import NeonSquare.backend.models.Reaction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, UUID> {

    // Return *all* reactions by this user on this post, newest first
    @Query("""
           SELECT r FROM Post p
             JOIN p.reactions r
            WHERE p.id = :postId AND r.user.id = :userId
            ORDER BY r.createdAt DESC, r.id DESC
           """)
    List<Reaction> findAllByUserAndPost(@Param("userId") UUID userId,
                                        @Param("postId") UUID postId);

    // Or, if you prefer, a pageable single fetch:
    @Query("""
           SELECT r FROM Post p
             JOIN p.reactions r
            WHERE p.id = :postId AND r.user.id = :userId
            ORDER BY r.createdAt DESC, r.id DESC
           """)
    List<Reaction> findTopByUserAndPost(@Param("userId") UUID userId,
                                        @Param("postId") UUID postId,
                                        Pageable pageable);
}
