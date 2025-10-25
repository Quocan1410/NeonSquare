// NeonSquare/backend/src/main/java/NeonSquare/backend/repositories/ImageRepository.java
package NeonSquare.backend.repositories;

import NeonSquare.backend.models.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ImageRepository extends JpaRepository<Image, UUID> {
}
