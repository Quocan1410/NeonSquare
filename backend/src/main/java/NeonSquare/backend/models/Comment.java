package NeonSquare.backend.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Comment {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    private String text;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;


    @OneToMany
    @JoinTable(
            name = "reaction_comment",
            joinColumns = @JoinColumn(name = "comment_id"),
            inverseJoinColumns = @JoinColumn(name = "reaction_id")
    )
    private List<Reaction> reactions;

    private LocalDate updateAt;

    @OneToOne
    private  User user;
}
