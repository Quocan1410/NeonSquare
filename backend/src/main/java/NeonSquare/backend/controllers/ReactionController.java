// backend/src/main/java/NeonSquare/backend/controllers/ReactionController.java
package NeonSquare.backend.controllers;

import NeonSquare.backend.dto.ReactionDTO;
import NeonSquare.backend.models.Post;
import NeonSquare.backend.models.Reaction;
import NeonSquare.backend.models.User;
import NeonSquare.backend.models.enums.NotificationType;
import NeonSquare.backend.models.enums.ReactionType;
import NeonSquare.backend.services.NotificationService;
import NeonSquare.backend.services.PostService;
import NeonSquare.backend.services.ReactionService;
import NeonSquare.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class ReactionController {

    private final PostService postService;
    private final UserService userService;
    private final ReactionService reactionService;
    private final NotificationService notificationService;

    @GetMapping("/{postId}/reactions")
    public List<ReactionDTO> list(@PathVariable UUID postId) {
        Post p = postService.getPost(postId);
        return p.getReactions() == null ? List.of() : p.getReactions().stream().map(ReactionDTO::new).toList();
    }

    @PutMapping("/{postId}/like")
    public ResponseEntity<ReactionDTO> like(@PathVariable UUID postId,
                                            @RequestParam UUID userId) {
        Post post = postService.getPost(postId);
        User user = userService.getUser(userId);

        Reaction existing = reactionService.findReactionByUserAndPost(userId, postId);
        if (existing != null && existing.getType() == ReactionType.LIKE) {
            return ResponseEntity.ok(new ReactionDTO(existing));
        }
        if (existing != null) {
            reactionService.removeReactionFromPost(postId, userId);
        }

        Reaction r = new Reaction();
        r.setType(ReactionType.LIKE);
        r.setUser(user);
        r.setCreatedAt(LocalDateTime.now());

        // If Reaction has a post field, keep both sides in sync:
        try {
            r.getClass().getMethod("setPost", Post.class); // reflective check
            try { r.getClass().getMethod("setPost", Post.class).invoke(r, post); } catch (Exception ignored) {}
        } catch (NoSuchMethodException ignored) {
            // Reaction has no post field — fine.
        }

        r = reactionService.createReaction(r);

        post.getReactions().add(r);
        postService.updatePost(post);

        if (post.getAuthor() != null && post.getAuthor().getId() != null && !post.getAuthor().getId().equals(userId)) {
            String who = ((user.getFirstName() == null ? "" : user.getFirstName()) + " " +
                          (user.getLastName() == null ? "" : user.getLastName())).trim();
            String msg = (who.isBlank() ? "Someone" : who) + " liked your post";
            log.info("Emitting LIKE to post author {} from {}", post.getAuthor().getId(), userId);
            notificationService.createAndPush(post.getAuthor().getId(), NotificationType.LIKE, msg);
        }

        return ResponseEntity.ok(new ReactionDTO(r));
    }

    @DeleteMapping("/{postId}/like")
    public ResponseEntity<Void> unlike(@PathVariable UUID postId, @RequestParam UUID userId) {
        boolean removed = reactionService.removeReactionFromPost(postId, userId);
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
