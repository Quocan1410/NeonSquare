package NeonSquare.backend.repositories;

import NeonSquare.backend.models.Comment;
import NeonSquare.backend.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByPost(Post post);

    List<Comment> findByComment_Id(UUID commentId);

    List<Comment> findByPost_IdAndCommentIsNull(UUID postId);
}
