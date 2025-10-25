package NeonSquare.backend.dto;

import NeonSquare.backend.models.Post;
import NeonSquare.backend.models.enums.PostVisibility;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class PostDTO {
    private UUID id;
    private String text;
    private UserDTO author;
    private PostVisibility visibility;
    private LocalDate updateAt;
    private List<ReactionDTO> reactions;
    private List<String> imageUrls;
    private int commentCount;
    private int reactionCount;

    public PostDTO(Post post){
        id = post.getId();
        text = post.getContent();
        author = new UserDTO(post.getAuthor());
        visibility = post.getVisibility();
        updateAt = post.getUpdatedAt() != null ? post.getUpdatedAt().toLocalDate() : null;
        imageUrls = post.getImages() != null ? post.getImages().stream().map(image -> "/api/images/" + image.getId()).toList() : List.of();
        commentCount = post.getComments() != null ? post.getComments().size() : 0;
        reactionCount = post.getReactions() != null ? post.getReactions().size() : 0;
        reactions = post.getReactions() != null ? post.getReactions().stream().map(reaction -> new ReactionDTO(reaction)).toList() : List.of();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public UserDTO getAuthor() {
        return author;
    }

    public void setAuthor(UserDTO author) {
        this.author = author;
    }

    public PostVisibility getVisibility() {
        return visibility;
    }

    public void setVisibility(PostVisibility visibility) {
        this.visibility = visibility;
    }

    public LocalDate getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(LocalDate updateAt) {
        this.updateAt = updateAt;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public int getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(int commentCount) {
        this.commentCount = commentCount;
    }

    public int getReactionCount() {
        return reactionCount;
    }

    public void setReactionCount(int reactionCount) {
        this.reactionCount = reactionCount;
    }

    public List<ReactionDTO> getReactions() {
        return reactions;
    }

    public void setReactions(List<ReactionDTO> reactions) {
        this.reactions = reactions;
    }
}
