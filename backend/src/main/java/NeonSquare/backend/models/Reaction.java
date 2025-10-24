package NeonSquare.backend.models;

import NeonSquare.backend.models.enums.ReactionType;
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
public class Reaction {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Enumerated(EnumType.ORDINAL)
    private ReactionType reaction;

    @OneToOne
    private User user;

}
