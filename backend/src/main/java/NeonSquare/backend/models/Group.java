package NeonSquare.backend.models;

import NeonSquare.backend.models.enums.GroupVisibility;
import NeonSquare.backend.models.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "user_group")
public class Group {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @OneToOne
    private Image groupPic;

    @Enumerated(EnumType.ORDINAL)
    private GroupVisibility visibility;

    @OneToMany
    @JoinTable(
            name = "group_post",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "post_id")
    )
    private List<Post> posts;


    @ManyToMany
    @JoinTable(
            name = "member_group",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members;

    @OneToOne
    private User groupAdmin;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Image getGroupPic() {
        return groupPic;
    }

    public void setGroupPic(Image groupPic) {
        this.groupPic = groupPic;
    }

    public GroupVisibility getVisibility() {
        return visibility;
    }

    public void setVisibility(GroupVisibility visibility) {
        this.visibility = visibility;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }


    public List<User> getMembers() {
        return members;
    }

    public void setMembers(List<User> members) {
        this.members = members;
    }

    public User getGroupAdmin() {
        return groupAdmin;
    }

    public void setGroupAdmin(User groupAdmin) {
        this.groupAdmin = groupAdmin;
    }
}
