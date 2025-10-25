package NeonSquare.backend.dto;

import NeonSquare.backend.models.Reaction;
import NeonSquare.backend.models.enums.ReactionType;

import java.time.LocalDateTime;
import java.util.UUID;

public class ReactionDTO {
    private UUID id;
    private ReactionType type;
    private UUID userId;
    private LocalDateTime createdAt;
    private UserDTO user;

    public ReactionDTO() {
    }

    public ReactionDTO(ReactionType type, UUID userId, LocalDateTime createdAt) {
        this.type = type;
        this.userId = userId;
        this.createdAt = createdAt;
    }

    public ReactionDTO(Reaction reaction){
        this.id = reaction.getId();
        this.type = reaction.getType();
        this.userId = reaction.getUser().getId();
        this.createdAt = reaction.getCreatedAt();
        this.user = new UserDTO(reaction.getUser());
    }

    public ReactionType getType() {
        return type;
    }

    public void setType(ReactionType type) {
        this.type = type;
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

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
}
