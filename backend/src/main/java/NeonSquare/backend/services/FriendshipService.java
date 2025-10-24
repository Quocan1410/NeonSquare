package NeonSquare.backend.services;

import NeonSquare.backend.models.Friendship;
import NeonSquare.backend.models.enums.Status;
import NeonSquare.backend.repositories.FriendshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class FriendshipService {

    private final FriendshipRepository repository;

    @Autowired
    public FriendshipService(FriendshipRepository repository) {
        this.repository = repository;
    }

    public List<Friendship> getAllFriendships() {
        return repository.findAll();
    }

    public Friendship getFriendshipById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));
    }

    public Friendship createFriendship(Friendship friendship) {
        friendship.setStatus(Status.pending);
        return repository.save(friendship);
    }

    public Friendship updateStatus(UUID id, Status status) {
        Friendship friendship = getFriendshipById(id);
        friendship.setStatus(status);
        return repository.save(friendship);
    }

    public void deleteFriendship(UUID id) {
        repository.deleteById(id);
    }

    public List<Friendship> getAcceptedFriendshipsForUser(UUID userId) {
        return repository.findAcceptedFriendshipsForUser(Status.accepted, userId);
    }

    public boolean acceptFriendship(UUID senderId, UUID receiverId) {
        int updated = repository.acceptFriendship(senderId, receiverId, Status.accepted);
        return updated > 0;
    }

    public boolean removeFriendship(UUID senderId, UUID receiverId) {
        int deleted = repository.deleteFriendship(senderId, receiverId);
        return deleted > 0;
    }
}
