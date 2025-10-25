package NeonSquare.backend.controllers;

import NeonSquare.backend.dto.PostDTO;
import NeonSquare.backend.dto.PostRequest;
import NeonSquare.backend.dto.ReactionDTO;
import NeonSquare.backend.models.Post;
import NeonSquare.backend.models.Reaction;
import NeonSquare.backend.models.User;
import NeonSquare.backend.services.ImageService;
import NeonSquare.backend.services.PostService;
import NeonSquare.backend.services.ReactionService;
import NeonSquare.backend.services.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final ImageService imageService;

    private  final PostService postService;

    private  final UserService userService;

    private final ReactionService reactionService;

    @Autowired
    public PostController(ImageService imageService, PostService postService, UserService userService, ReactionService reactionService) {
        this.imageService = imageService;
        this.postService = postService;
        this.userService = userService;
        this.reactionService = reactionService;
    }



    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllFilterPosts() {
        List<Post> posts = postService.getAllFilterPosts();
        List<PostDTO> postResponses = posts.stream()
            .map(PostDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(postResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable UUID id) {
        Post post = postService.getPost(id);
        return ResponseEntity.ok(new PostDTO(post));
    }

    @PostMapping
    public ResponseEntity<PostDTO> createPost(@RequestParam("post") String post,
                                                   @RequestPart(value = "files", required = false) List<MultipartFile> files) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        PostRequest postRequest = mapper.readValue(post, PostRequest.class);

        User user = userService.getUser(postRequest.getUserId());
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        Post createPost = new Post();
        createPost.setContent(postRequest.getText());
        createPost.setVisibility(postRequest.getVisibility());
        createPost.setAuthor(user);

        if (files != null && !files.isEmpty()) {
            var images = imageService.saveImages(files);
            createPost.setImages(images);
        }
        Post savedPost = postService.createPost(createPost);
        return ResponseEntity.ok(new PostDTO(savedPost));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable UUID id) {
        boolean deleted = postService.removePost(id);
        if (deleted) {
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    @PostMapping("/{id}/reaction")
    public ResponseEntity<ReactionDTO> createReaction(@PathVariable UUID id, @RequestParam("reaction") String reaction) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        ReactionDTO reactionDTO = mapper.readValue(reaction, ReactionDTO.class);

        Post post = postService.getPost(id);
        User user = userService.getUser(reactionDTO.getUserId());

        if (post == null || user == null) {
            return ResponseEntity.badRequest().build();
        }
        Reaction createReaction = new Reaction();
        createReaction.setCreatedAt(reactionDTO.getCreatedAt());
        createReaction.setType(createReaction.getType());
        createReaction.setUser(user);

        Reaction saveReaction = reactionService.createReaction(createReaction);
        post.getReactions().add(saveReaction);
        postService.updatePost(post);
        return  ResponseEntity.ok(reactionDTO);
    }
}
