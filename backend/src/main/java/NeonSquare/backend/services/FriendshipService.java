// NeonSquare/backend/src/main/java/NeonSquare/backend/services/FriendshipService.java
package NeonSquare.backend.services;

import NeonSquare.backend.models.Friendship;
import NeonSquare.backend.models.User;
import NeonSquare.backend.models.enums.FriendshipStatus;
import NeonSquare.backend.models.enums.NotificationType;
import NeonSquare.backend.repositories.FriendshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Pushes notifications:
 * - createFriendship(sender -> receiver): "X sent you a friend request"
 * - acceptFriendship(receiver -> sender): "X accepted your friend request"
 * - No notification on delete/reject (by design)
 */
@Service
public class FriendshipService {

    private final FriendshipRepository repository;
    private final NotificationService notificationService;

    @Autowired
    public FriendshipService(FriendshipRepository repository,
                             NotificationService notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }

    public List<Friendship> getAllFriendships() {
        return repository.findAll();
    }

    public Friendship getFriendshipById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));
    }

    @Transactional
    public Friendship createFriendship(Friendship friendship) {
        friendship.setStatus(FriendshipStatus.PENDING);
        Friendship saved = repository.save(friendship);

        try {
            User sender = saved.getSender();
            User receiver = saved.getReceiver();
            if (sender != null && receiver != null &&
                !sender.getId().equals(receiver.getId())) {
                String who = (sender.getFirstName() + " " + sender.getLastName()).trim();
                String msg = who.isBlank() ? "You received a friend request"
                                           : who + " sent you a friend request";
                NotificationType type = NotificationType.valueOf("friendRequest");
                notificationService.createAndPush(receiver.getId(), type, msg);
            }
        } catch (Exception ignored) {}

        return saved;
    }

    @Transactional
    public Friendship updateStatus(UUID id, FriendshipStatus status) {
        Friendship friendship = getFriendshipById(id);
        friendship.setStatus(status);
        return repository.save(friendship);
    }

    @Transactional
    public void deleteFriendship(UUID id) {
        repository.deleteById(id);
    }

    public List<Friendship> getAcceptedFriendshipsForUser(UUID userId) {
        return repository.findAcceptedFriendshipsForUser(FriendshipStatus.ACCEPTED, userId);
    }

    /**
     * Receiver accepts sender's request.
     */
    @Transactional
    public boolean acceptFriendship(UUID senderId, UUID receiverId) {
        int updated = repository.acceptFriendship(senderId, receiverId, FriendshipStatus.ACCEPTED);
        if (updated <= 0) return false;

        try {
            Friendship f = repository.findBySender_IdAndReceiver_Id(senderId, receiverId);
            if (f != null && f.getSender() != null && f.getReceiver() != null) {
                User sender = f.getSender();
                User receiver = f.getReceiver(); // the one who accepted
                if (!sender.getId().equals(receiver.getId())) {
                    String who = (receiver.getFirstName() + " " + receiver.getLastName()).trim();
                    String msg = who.isBlank() ? "Your friend request was accepted"
                                               : who + " accepted your friend request";
                    // Use the general post/content bucket for accept; no special type required
                    NotificationType type = NotificationType.valueOf("postUpdate");
                    notificationService.createAndPush(sender.getId(), type, msg);
                }
            }
        } catch (Exception ignored) {}

        return true;
    }

    @Transactional
    public boolean removeFriendship(UUID senderId, UUID receiverId) {
        int deleted = repository.deleteFriendship(senderId, receiverId);
        return deleted > 0;
    }
}
