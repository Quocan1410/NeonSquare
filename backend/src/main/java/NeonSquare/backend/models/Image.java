package NeonSquare.backend.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Image {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    private String name;

    @Lob
    private byte[] data;


}
