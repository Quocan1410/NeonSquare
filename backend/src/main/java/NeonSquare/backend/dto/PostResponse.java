package NeonSquare.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private UUID id;
    private String text;
    private UserResponse author;
    private String visibility;
    private LocalDateTime updateAt;
    private int commentCount;
    private int reactionCount;
    private List<String> imageUrls;
}

