package NeonSquare.backend.controllers;


import NeonSquare.backend.dto.CommentDTO;
import NeonSquare.backend.dto.CommentRequest;
import NeonSquare.backend.dto.PostDTO;
import NeonSquare.backend.dto.PostRequest;
import NeonSquare.backend.models.Comment;
import NeonSquare.backend.models.Post;
import NeonSquare.backend.models.User;
import NeonSquare.backend.services.CommentService;
import NeonSquare.backend.services.PostService;
import NeonSquare.backend.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/comment")
public class CommentController {
    private final CommentService commentService;
    private final PostService postService;
    private final UserService userService;

    public CommentController(CommentService commentService, PostService postService, UserService userService) {
        this.commentService = commentService;
        this.postService = postService;
        this.userService = userService;
    }

    @PostMapping("/{postId}/post")
    public ResponseEntity<CommentDTO> createComment(@PathVariable UUID postId, @RequestParam("comment") String comment) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        CommentRequest commentRequest = mapper.readValue(comment, CommentRequest.class);
        User user = userService.getUser(commentRequest.getUserId());
        Post post = postService.getPost(postId);

        if (user == null || post == null) {
            return ResponseEntity.badRequest().build();
        }

        Comment createComment = new Comment();
        createComment.setContent(commentRequest.getContent());
        createComment.setPost(post);
        createComment.setAuthor(user);
        createComment.setCreatedAt(commentRequest.getCreatedAt());

        Comment saveComment = commentService.createComment(createComment);
        return  ResponseEntity.ok(new CommentDTO(saveComment));
    }

    @PostMapping("/{commentId}/comment")
    public ResponseEntity<CommentDTO> createReplyComment(@PathVariable UUID commentId, @RequestParam("comment") String comment) throws IOException{
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        CommentRequest commentRequest = mapper.readValue(comment, CommentRequest.class);
        Comment parrentComment = commentService.getComment(commentId);
        Comment createComment = new Comment();
        User user = userService.getUser(commentRequest.getUserId());

        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        createComment.setContent(commentRequest.getContent());
        createComment.setPost(parrentComment.getPost());
        createComment.setAuthor(user);
        createComment.setCreatedAt(commentRequest.getCreatedAt());
        createComment.setComment(parrentComment);

        Comment saveComment = commentService.createComment(createComment);
        return  ResponseEntity.ok(new CommentDTO(saveComment));
    }

    @GetMapping("/post/{postId}/comments")
    public ResponseEntity<List<CommentDTO>> getCommentsOfPost(@PathVariable UUID postId) {
        Post post = postService.getPost(postId);
        if (post == null) {
            return ResponseEntity.notFound().build();
        }

        List<Comment> comments = commentService.getRootCommentsByPost(post.getId());
        List<CommentDTO> commentDTOs = comments.stream()
                .map(CommentDTO::new)
                .toList();

        return ResponseEntity.ok(commentDTOs);
    }

    @GetMapping("/{commentId}/replies")
    public ResponseEntity<List<CommentDTO>> getReplies(@PathVariable UUID commentId) {
        List<Comment> replies = commentService.getReplies(commentId);
        List<CommentDTO> replyDTOs = replies.stream()
                .map(CommentDTO::new)
                .toList();
        return ResponseEntity.ok(replyDTOs);
    }

}
