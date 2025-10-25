package NeonSquare.backend.controllers;

import NeonSquare.backend.dto.PostResponse;
import NeonSquare.backend.dto.UserResponse;
import NeonSquare.backend.models.Post;
import NeonSquare.backend.models.User;
import NeonSquare.backend.models.enums.PostVisibility;
import NeonSquare.backend.repositories.PostRepository;
import NeonSquare.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        List<PostResponse> postResponses = posts.stream()
            .map(this::convertToPostResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(postResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable UUID id) {
        return postRepository.findById(id)
            .map(post -> ResponseEntity.ok(convertToPostResponse(post)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@RequestBody CreatePostRequest request) {
        User user = userRepository.findById(request.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        Post post = new Post();
        post.setText(request.getText());
        post.setUser(user);
        post.setVisibility(PostVisibility.valueOf(request.getVisibility()));
        post.setUpdateAt(java.time.LocalDate.now());

        Post savedPost = postRepository.save(post);
        return ResponseEntity.ok(convertToPostResponse(savedPost));
    }

    private PostResponse convertToPostResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setText(post.getText());
        response.setVisibility(post.getVisibility().toString());
        response.setUpdateAt(post.getUpdateAt());
        response.setCommentCount(post.getComments() != null ? post.getComments().size() : 0);
        response.setReactionCount(post.getReactions() != null ? post.getReactions().size() : 0);
        
        // Convert author
        if (post.getUser() != null) {
            UserResponse author = new UserResponse();
            author.setId(post.getUser().getId());
            author.setFirstName(post.getUser().getFirstName());
            author.setLastName(post.getUser().getLastName());
            author.setEmail(post.getUser().getEmail());
            author.setProfilePicUrl(post.getUser().getProfilePic() != null ? "/api/images/" + post.getUser().getProfilePic().getId() : null);
            author.setOnline(true);
            author.setLastSeen("Online now");
            response.setAuthor(author);
        }
        
        return response;
    }

    // Inner class for create post request
    public static class CreatePostRequest {
        private UUID userId;
        private String text;
        private String visibility;

        // Getters and setters
        public UUID getUserId() { return userId; }
        public void setUserId(UUID userId) { this.userId = userId; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        public String getVisibility() { return visibility; }
        public void setVisibility(String visibility) { this.visibility = visibility; }
    }
}
