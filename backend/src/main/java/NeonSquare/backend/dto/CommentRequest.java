// backend/src/main/java/NeonSquare/backend/dto/CommentRequest.java
package NeonSquare.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class CommentRequest {
    private String content;
    private UUID userId;
    private LocalDateTime createdAt;

    public CommentRequest() {
    }

    public CommentRequest(UUID userId, String content, LocalDateTime createdAt) {
        this.userId = userId;
        this.content = content;
        this.createdAt = createdAt;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
