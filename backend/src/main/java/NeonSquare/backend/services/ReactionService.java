// backend/src/main/java/NeonSquare/backend/services/ReactionService.java
package NeonSquare.backend.services;

import NeonSquare.backend.models.Post;
import NeonSquare.backend.models.Reaction;
import NeonSquare.backend.repositories.PostRepository;
import NeonSquare.backend.repositories.ReactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ReactionService {
    private final ReactionRepository reactionRepository;
    private final PostRepository postRepository;

    public ReactionService(ReactionRepository reactionRepository, PostRepository postRepository) {
        this.reactionRepository = reactionRepository;
        this.postRepository = postRepository;
    }

    @Transactional
    public Reaction createReaction(Reaction reaction) {
        return reactionRepository.save(reaction);
    }

    @Transactional
    public Reaction updateReaction(Reaction reaction) {
        return reactionRepository.save(reaction);
    }

    /**
     * Returns the newest reaction by (user, post).
     * If duplicates exist, prunes the older ones.
     */
    @Transactional
    public Reaction findReactionByUserAndPost(UUID userId, UUID postId) {
        List<Reaction> list = reactionRepository.findAllByUserAndPost(userId, postId);
        if (list.isEmpty()) return null;
        Reaction newest = list.get(0);
        // prune older duplicates, if any
        for (int i = 1; i < list.size(); i++) {
            reactionRepository.delete(list.get(i));
        }
        return newest;
    }

    /** Remove the current user's reaction from a post (idempotent). */
    @Transactional
    public boolean removeReactionFromPost(UUID postId, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        List<Reaction> list = reactionRepository.findAllByUserAndPost(userId, postId);
        if (list.isEmpty()) return false;

        // remove all from join + table
        for (Reaction r : list) {
            post.getReactions().removeIf(x -> x.getId().equals(r.getId()));
            reactionRepository.delete(r);
        }
        postRepository.save(post);
        return true;
    }
}
