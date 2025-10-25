// backend/src/main/java/NeonSquare/backend/services/FriendshipService.java
package NeonSquare.backend.services;

import NeonSquare.backend.models.Friendship;
import NeonSquare.backend.models.User;
import NeonSquare.backend.models.enums.FriendshipStatus;
import NeonSquare.backend.models.enums.NotificationType;
import NeonSquare.backend.repositories.FriendshipRepository;
import NeonSquare.backend.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class FriendshipService {

    private final FriendshipRepository repository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Autowired
    public FriendshipService(FriendshipRepository repository,
                             NotificationService notificationService,
                             UserRepository userRepository) {
        this.repository = repository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    public List<Friendship> getAllFriendships() {
        return repository.findAll();
    }

    public Friendship getFriendshipById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));
    }

    /** Idempotent create with managed Users attached. */
    @Transactional
    public Friendship createFriendship(Friendship payload) {
        if (payload == null) throw new IllegalArgumentException("Friendship body is required");

        UUID senderId = payload.getSender() != null ? payload.getSender().getId() : null;
        UUID receiverId = payload.getReceiver() != null ? payload.getReceiver().getId() : null;

        if (senderId == null || receiverId == null) throw new IllegalArgumentException("senderId and receiverId are required");
        if (senderId.equals(receiverId)) throw new IllegalArgumentException("Cannot friend yourself");

        Friendship existing = repository.findByPair(senderId, receiverId);
        if (existing != null) return existing;

        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("Receiver not found"));

        Friendship f = new Friendship();
        f.setSender(sender);
        f.setReceiver(receiver);
        f.setStatus(FriendshipStatus.PENDING);
        f.setCreatedAt(LocalDateTime.now());

        Friendship saved = repository.save(f);

        try {
            String who = ((sender.getFirstName() == null ? "" : sender.getFirstName()) + " " +
                          (sender.getLastName()  == null ? "" : sender.getLastName())).trim();
            String msg = who.isBlank() ? "You received a friend request"
                                       : who + " sent you a friend request";
            log.info("Emitting FRIEND_REQUEST to {} (from {}): {}", receiver.getId(), sender.getId(), msg);
            notificationService.createAndPush(receiver.getId(), NotificationType.FRIEND_REQUEST, msg);
        } catch (Exception e) {
            log.warn("Failed to emit FRIEND_REQUEST notification: {}", e.getMessage());
        }

        return saved;
    }

    @Transactional
    public Friendship updateStatus(UUID id, FriendshipStatus status) {
        Friendship friendship = getFriendshipById(id);
        friendship.setStatus(status);
        return repository.save(friendship);
    }

    /** Delete by primary key (used by DELETE /api/friendships/{id}). */
    @Transactional
    public void deleteFriendship(UUID id) {
        repository.deleteById(id);
    }

    /** Delete by pair (used by DELETE /api/friendships/delete?senderId&receiverId). */
    @Transactional
    public boolean deleteFriendship(UUID senderId, UUID receiverId) {
        int deleted = 0;
        try {
            Friendship f = repository.findBySender_IdAndReceiver_Id(senderId, receiverId);
            if (f == null) f = repository.findBySender_IdAndReceiver_Id(receiverId, senderId);
            if (f != null) {
                repository.deleteById(f.getId());
                deleted = 1;
            }
        } catch (Exception e) {
            deleted = 0;
        }
        return deleted > 0;
    }

    public List<Friendship> getAcceptedFriendshipsForUser(UUID userId) {
        return repository.findAcceptedFriendshipsForUser(FriendshipStatus.ACCEPTED, userId);
    }

    /** Accept request by sender/receiver regardless of direction. */
    @Transactional
    public boolean acceptFriendship(UUID senderId, UUID receiverId) {
        Friendship f = repository.findBySender_IdAndReceiver_Id(senderId, receiverId);
        if (f == null) f = repository.findBySender_IdAndReceiver_Id(receiverId, senderId);
        if (f == null) return false;

        f.setStatus(FriendshipStatus.ACCEPTED);
        repository.save(f);

        try {
            User sender = f.getSender();
            User receiver = f.getReceiver();
            if (sender != null && receiver != null && sender.getId() != null && receiver.getId() != null) {
                String who = ((receiver.getFirstName() == null ? "" : receiver.getFirstName()) + " " +
                              (receiver.getLastName()  == null ? "" : receiver.getLastName())).trim();
                String msg = who.isBlank() ? "Your friend request was accepted" : who + " accepted your friend request";
                log.info("Emitting FRIEND_ACCEPTED to {} (accepted by {}): {}", sender.getId(), receiver.getId(), msg);
                notificationService.createAndPush(sender.getId(), NotificationType.FRIEND_ACCEPTED, msg);
            }
        } catch (Exception e) {
            log.warn("Failed to emit FRIEND_ACCEPTED notification: {}", e.getMessage());
        }

        return true;
    }

    @Transactional(readOnly = true)
    public List<Friendship> listPendingForReceiver(UUID userId) {
        return repository.findByReceiver_IdAndStatus(userId, FriendshipStatus.PENDING);
    }

    @Transactional
    public boolean acceptById(UUID requestId) {
        Optional<Friendship> opt = repository.findById(requestId);
        if (opt.isEmpty()) return false;

        Friendship f = opt.get();
        f.setStatus(FriendshipStatus.ACCEPTED);
        repository.save(f);

        try {
            if (f.getSender() != null && f.getReceiver() != null
                    && f.getSender().getId() != null && f.getReceiver().getId() != null) {
                String who = ((f.getReceiver().getFirstName() == null ? "" : f.getReceiver().getFirstName()) + " " +
                              (f.getReceiver().getLastName()  == null ? "" : f.getReceiver().getLastName())).trim();
                String msg = who.isBlank() ? "Your friend request was accepted" : who + " accepted your friend request";
                log.info("Emitting FRIEND_ACCEPTED to {} (acceptById by {}): {}", f.getSender().getId(), f.getReceiver().getId(), msg);
                notificationService.createAndPush(f.getSender().getId(), NotificationType.FRIEND_ACCEPTED, msg);
            }
        } catch (Exception e) {
            log.warn("Failed to emit FRIEND_ACCEPTED notification (acceptById): {}", e.getMessage());
        }

        return true;
    }

    @Transactional
    public boolean rejectById(UUID requestId) {
        if (!repository.existsById(requestId)) return false;
        repository.deleteById(requestId);
        return true;
    }
}
