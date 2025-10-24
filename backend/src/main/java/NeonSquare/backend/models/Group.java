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

    @Enumerated(EnumType.ORDINAL)
    private Status status;

    @ManyToMany
    @JoinTable(
            name = "member_group",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members;

    @OneToOne
    private User groupAdmin;

}
