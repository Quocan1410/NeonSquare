package NeonSquare.backend.dto;

import NeonSquare.backend.models.Post;
import NeonSquare.backend.models.enums.PostVisibility;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class PostDTO {
    private UUID id;
    private String text;
    private UserDTO user;
    private PostVisibility visibility;
    private LocalDate updateAt;
    private List<String> profilePicUrls;

    public PostDTO(Post post){
        id = post.getId();
        text = post.getText();
        user = new UserDTO(post.getUser());
        visibility = post.getVisibility();
        updateAt = post.getUpdateAt();
        profilePicUrls = post.getImages().stream().map(image -> "/api/images/" + image.getId()).toList();
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

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
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

    public List<String> getProfilePicUrls() {
        return profilePicUrls;
    }

    public void setProfilePicUrls(List<String> profilePicUrls) {
        this.profilePicUrls = profilePicUrls;
    }
}
