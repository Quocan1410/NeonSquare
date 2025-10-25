package NeonSquare.backend.services;

import NeonSquare.backend.models.Post;
import NeonSquare.backend.models.User;
import NeonSquare.backend.repositories.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(PostRepository postService) {
        this.postRepository = postService;
    }

    public List<Post> getAllFilterPosts(){
        return postRepository.findAllByOrderByUpdatedAtDesc();
    }

    public Post getPost(UUID id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    @Transactional
    public Post createPost(Post post){
        return postRepository.save(post);
    }

    @Transactional
    public boolean removePost(UUID postId) {
        if (postRepository.existsById(postId)) {
            postRepository.deleteById(postId);
            return true;
        }
        return false;
    }

    @Transactional
    public Post updatePost(Post post){
        return postRepository.save(post);
    }
}
