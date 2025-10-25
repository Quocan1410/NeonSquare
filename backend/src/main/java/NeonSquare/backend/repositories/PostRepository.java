// NeonSquare/backend/src/main/java/NeonSquare/backend/repositories/PostRepository.java
package NeonSquare.backend.repositories;

import NeonSquare.backend.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    List<Post> findAllByOrderByUpdatedAtDesc();
}

