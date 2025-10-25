// NeonSquare/backend/src/main/java/NeonSquare/backend/services/PostService.java
package NeonSquare.backend.services;

import NeonSquare.backend.models.Comment;
import NeonSquare.backend.models.Post;
import NeonSquare.backend.models.User;
import NeonSquare.backend.models.enums.NotificationType;
import NeonSquare.backend.repositories.CommentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Creates comments & replies and pushes notifications:
 * - Comment on a post  -> notify post author (except self)
 * - Reply to a comment -> notify parent comment author (except self)
 */
@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final NotificationService notificationService;

    public CommentService(CommentRepository commentRepository,
                          NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Comment createComment(Comment comment) {
        Comment saved = commentRepository.save(comment);

        try {
            // If this is a reply, notify the parent comment author
            if (saved.getComment() != null) {
                Comment parent = saved.getComment();
                User parentAuthor = parent.getAuthor();  // ✅ use author
                User replier = saved.getAuthor();        // ✅ use author

                if (parentAuthor != null && replier != null &&
                        !parentAuthor.getId().equals(replier.getId())) {
                    String who = (replier.getFirstName() + " " + replier.getLastName()).trim();
                    String msg = who.isBlank()
                            ? "Someone replied to your comment"
                            : who + " replied to your comment";
                    notificationService.createAndPush(
                            parentAuthor.getId(),
                            safeType("POST_UPDATE", "POST", "COMMENT", "POSTUPDATE"),
                            msg
                    );
                }
                return saved;
            }

            // Otherwise this is a root comment on a post: notify the post author
            Post post = saved.getPost();
            if (post != null) {
                User postAuthor = post.getAuthor();
                User commenter = saved.getAuthor(); // ✅ use author
                if (postAuthor != null && commenter != null &&
                        !postAuthor.getId().equals(commenter.getId())) {
                    String who = (commenter.getFirstName() + " " + commenter.getLastName()).trim();
                    String msg = who.isBlank()
                            ? "Someone commented on your post"
                            : who + " commented on your post";
                    notificationService.createAndPush(
                            postAuthor.getId(),
                            safeType("POST_UPDATE", "POST", "COMMENT", "POSTUPDATE"),
                            msg
                    );
                }
            }
        } catch (Exception ignored) {
            // Never fail the write because of notification; log if desired
        }

        return saved;
    }

    public Comment getComment(UUID id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    public List<Comment> getCommentsByPost(Post post) {
        return commentRepository.findByPost(post);
    }

    public List<Comment> getRootCommentsByPost(UUID postId) {
        return commentRepository.findByPost_IdAndCommentIsNull(postId);
    }

    public List<Comment> getReplies(UUID commentId) {
        return commentRepository.findByComment_Id(commentId);
    }

    /**
     * Try to resolve a NotificationType by several candidate names.
     * Falls back to the first enum constant if none match.
     */
    private NotificationType safeType(String... candidates) {
        for (String c : candidates) {
            try {
                return NotificationType.valueOf(c);
            } catch (IllegalArgumentException ignored) {}
        }
        return NotificationType.values().length > 0 ? NotificationType.values()[0] : null;
    }
}
