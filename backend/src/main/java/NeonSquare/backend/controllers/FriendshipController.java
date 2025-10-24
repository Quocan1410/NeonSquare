package NeonSquare.backend.controllers;

import NeonSquare.backend.models.Friendship;
import NeonSquare.backend.models.enums.Status;
import NeonSquare.backend.services.FriendshipService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/friendships")
public class FriendshipController {

    private final FriendshipService service;

    public FriendshipController(FriendshipService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Friendship>> getAllFriendships() {
        return ResponseEntity.ok(service.getAllFriendships());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Friendship> getFriendship(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getFriendshipById(id));
    }

    @PostMapping
    public ResponseEntity<Friendship> createFriendship(@RequestBody Friendship friendship) {
        return ResponseEntity.ok(service.createFriendship(friendship));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Friendship> updateStatus(@PathVariable UUID id, @RequestParam Status status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFriendship(@PathVariable UUID id) {
        service.deleteFriendship(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}/accepted")
    public ResponseEntity<List<Friendship>> getAcceptedFriendships(@PathVariable UUID userId) {
        List<Friendship> friendships = service.getAcceptedFriendshipsForUser(userId);
        return ResponseEntity.ok(friendships);
    }

    @PostMapping("/accept")
    public ResponseEntity<String> acceptFriendship(
            @RequestParam UUID senderId,
            @RequestParam UUID receiverId
    ) {
        boolean success = service.acceptFriendship(senderId, receiverId);
        if (success) {
            return ResponseEntity.ok("Friendship accepted!");
        } else {
            return ResponseEntity.badRequest().body("No such friendship request found.");
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteFriendship(
            @RequestParam UUID senderId,
            @RequestParam UUID receiverId
    ) {
        boolean success = service.removeFriendship(senderId, receiverId);
        if (success) {
            return ResponseEntity.ok("Friendship deleted!");
        } else {
            return ResponseEntity.badRequest().body("No such friendship found.");
        }
    }

}
