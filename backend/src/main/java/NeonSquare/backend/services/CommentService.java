package NeonSquare.backend.services;

import NeonSquare.backend.models.Comment;
import NeonSquare.backend.models.Post;
import NeonSquare.backend.repositories.CommentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CommentService {
    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Transactional
    public Comment createComment(Comment comment){
        return  commentRepository.save(comment);
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
