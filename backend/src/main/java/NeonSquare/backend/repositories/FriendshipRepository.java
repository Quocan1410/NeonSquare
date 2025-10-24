package NeonSquare.backend.repositories;

import NeonSquare.backend.models.Friendship;
import NeonSquare.backend.models.enums.Status;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, UUID> {
    @Query("SELECT f FROM Friendship f " +
            "WHERE f.status = :status AND (f.sender.id = :userId OR f.receiver.id = :userId)")
    List<Friendship> findAcceptedFriendshipsForUser(
            @Param("status") Status status,
            @Param("userId") UUID userId
    );

    @Modifying
    @Transactional
    @Query("UPDATE Friendship f SET f.status = :status " +
            "WHERE f.sender.id = :senderId AND f.receiver.id = :receiverId")
    int acceptFriendship(
            @Param("senderId") UUID senderId,
            @Param("receiverId") UUID receiverId,
            @Param("status") Status status
    );

    @Modifying
    @Transactional
    @Query("DELETE FROM Friendship f WHERE f.sender.id = :senderId AND f.receiver.id = :receiverId")
    int deleteFriendship(
            @Param("senderId") UUID senderId,
            @Param("receiverId") UUID receiverId
    );
}
