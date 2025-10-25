package NeonSquare.backend.controllers;

import NeonSquare.backend.dto.PostDTO;
import NeonSquare.backend.dto.PostRequest;
import NeonSquare.backend.models.Post;
import NeonSquare.backend.models.User;
import NeonSquare.backend.services.ImageService;
import NeonSquare.backend.services.PostService;
import NeonSquare.backend.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    @Autowired
    public PostController(ImageService imageService, PostService postService, UserService userService) {
        this.imageService = imageService;
        this.postService = postService;
        this.userService = userService;
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


}
