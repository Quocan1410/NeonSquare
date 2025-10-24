package NeonSquare.backend.models;

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
@Table(name = "user_account")
public class User {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    @OneToOne
    private Image profilePic;

    @ManyToMany(mappedBy = "members")
    private List<Group> groups;

}
