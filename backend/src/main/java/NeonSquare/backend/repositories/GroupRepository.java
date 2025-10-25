// NeonSquare/backend/src/main/java/NeonSquare/backend/repositories/GroupRepository.java
package NeonSquare.backend.repositories;

import NeonSquare.backend.models.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GroupRepository extends JpaRepository<Group, UUID> {
}
