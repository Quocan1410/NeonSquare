// backend/src/main/java/NeonSquare/backend/dto/CommentDTO.java
package NeonSquare.backend.dto;

import NeonSquare.backend.models.Comment;

import java.time.LocalDateTime;
import java.util.UUID;

public class CommentDTO {
    private UUID id;
    private String content;
    private UUID userId;
    private UUID postId;
    private LocalDateTime createdAt;


    public CommentDTO(Comment comment){
        this.id = comment.getId();
        this.content = comment.getContent();
        this.userId = comment.getAuthor().getId();
        this.postId = comment.getPost().getId();
        this.createdAt = comment.getCreatedAt();
    }
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getPostId() {
        return postId;
    }

    public void setPostId(UUID postId) {
        this.postId = postId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
