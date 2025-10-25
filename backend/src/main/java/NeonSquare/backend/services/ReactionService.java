// NeonSquare/backend/src/main/java/NeonSquare/backend/services/ReactionService.java
package NeonSquare.backend.services;

import NeonSquare.backend.models.Post;
import NeonSquare.backend.models.Reaction;
import NeonSquare.backend.repositories.CommentRepository;
import NeonSquare.backend.repositories.PostRepository;
import NeonSquare.backend.repositories.ReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ReactionService {
    private final ReactionRepository reactionRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    @Autowired
    public ReactionService(ReactionRepository reactionRepository, PostRepository postRepository, CommentRepository commentRepository) {
        this.reactionRepository = reactionRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    @Transactional
    public Reaction createReaction(Reaction reaction){
        return reactionRepository.save(reaction);
    }

    @Transactional
    public Reaction updateReaction(Reaction reaction){return reactionRepository.save(reaction);}

    public Reaction findReactionByUserAndPost(UUID userId, UUID postId) {return reactionRepository.findReactionByUserAndPost(userId,postId);}

    @Transactional
    public boolean removeReaction(UUID postId) {
        if (postRepository.existsById(postId)) {
            postRepository.deleteById(postId);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean removeReactionFromPost(UUID postId, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Find and remove the user's reaction
        Reaction userReaction = findReactionByUserAndPost(userId, postId);
        if (userReaction != null) {
            post.getReactions().removeIf(r -> r.getId().equals(userReaction.getId()));
            reactionRepository.delete(userReaction);
            postRepository.save(post);
            return true;
        }
        return false;
    }

}
