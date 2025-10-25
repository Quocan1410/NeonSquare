// backend/src/main/java/NeonSquare/backend/repositories/NotificationRepository.java
package NeonSquare.backend.repositories;

import NeonSquare.backend.models.Notification;
import NeonSquare.backend.models.enums.NotificationStatus;
import NeonSquare.backend.models.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId ORDER BY n.createDate DESC")
    List<Notification> findByUserIdOrderByCreateDateDesc(@Param("userId") UUID userId);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.status = :status ORDER BY n.createDate DESC")
    List<Notification> findByUserIdAndStatusOrderByCreateDateDesc(
            @Param("userId") UUID userId, 
            @Param("status") NotificationStatus status
    );
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.type = :type ORDER BY n.createDate DESC")
    List<Notification> findByUserIdAndTypeOrderByCreateDateDesc(
            @Param("userId") UUID userId, 
            @Param("type") NotificationType type
    );
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.status = :status")
    long countByUserIdAndStatus(@Param("userId") UUID userId, @Param("status") NotificationStatus status);
}
