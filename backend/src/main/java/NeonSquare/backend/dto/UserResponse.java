// backend/src/main/java/NeonSquare/backend/dto/UserResponse.java
package NeonSquare.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String profilePicUrl;
    private boolean online;
    private String lastSeen;
}

