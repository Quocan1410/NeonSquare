// backend/src/main/java/NeonSquare/backend/services/CommentService.java
package NeonSquare.backend.services;

import NeonSquare.backend.models.Comment;
import NeonSquare.backend.models.Post;
import NeonSquare.backend.models.User;
import NeonSquare.backend.models.enums.NotificationType;
import NeonSquare.backend.repositories.CommentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
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
            // Reply
            if (saved.getComment() != null) {
                Comment parent = saved.getComment();
                User parentAuthor = parent.getAuthor();
                User replier      = saved.getAuthor();

                if (parentAuthor != null && replier != null
                        && parentAuthor.getId() != null && replier.getId() != null
                        && !parentAuthor.getId().equals(replier.getId())) {

                    String who = ((replier.getFirstName() == null ? "" : replier.getFirstName()) + " " +
                                  (replier.getLastName()  == null ? "" : replier.getLastName())).trim();
                    String msg = who.isBlank() ? "Someone replied to your comment"
                                               : who + " replied to your comment";

                    log.info("Emitting COMMENT to parent author {} from {}", parentAuthor.getId(), replier.getId());
                    notificationService.createAndPush(parentAuthor.getId(), NotificationType.COMMENT, msg);
                } else {
                    log.debug("Skip COMMENT (reply) self-notify or null ids.");
                }
                return saved;
            }

            // Root comment
            Post post = saved.getPost();
            if (post != null) {
                User postAuthor = post.getAuthor();
                User commenter  = saved.getAuthor();

                if (postAuthor != null && commenter != null
                        && postAuthor.getId() != null && commenter.getId() != null
                        && !postAuthor.getId().equals(commenter.getId())) {

                    String who = ((commenter.getFirstName() == null ? "" : commenter.getFirstName()) + " " +
                                  (commenter.getLastName()  == null ? "" : commenter.getLastName())).trim();
                    String msg = who.isBlank() ? "Someone commented on your post"
                                               : who + " commented on your post";

                    log.info("Emitting COMMENT to post author {} from {}", postAuthor.getId(), commenter.getId());
                    notificationService.createAndPush(postAuthor.getId(), NotificationType.COMMENT, msg);
                } else {
                    log.debug("Skip COMMENT (root) self-notify or null ids.");
                }
            }
        } catch (Exception e) {
            log.warn("Failed to emit COMMENT notification: {}", e.getMessage());
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
}
