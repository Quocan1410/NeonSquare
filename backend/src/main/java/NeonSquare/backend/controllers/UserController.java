package NeonSquare.backend.controllers;

import NeonSquare.backend.dto.UserResponse;
import NeonSquare.backend.models.User;
import NeonSquare.backend.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
// Remove @CrossOrigin here and rely on global CORS from SecurityConfig
public class UserController {

    private final UserService userService;
    private final ObjectMapper objectMapper;

    @Autowired
    public UserController(UserService userService, ObjectMapper objectMapper) {
        this.userService = userService;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserResponse> userResponses = users.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable UUID id) {
        User user = userService.getUser(id);
        return ResponseEntity.ok(convertToUserResponse(user));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(@RequestParam("query") String query) {
        List<User> users = userService.searchUsers(query);
        List<UserResponse> userResponses = users.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userResponses);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> createUser(
            @RequestParam("user") String user,
            @RequestPart(value = "profilePic", required = false) MultipartFile profilePic
    ) throws IOException {
        User createUser = objectMapper.readValue(user, User.class);
        User savedUser = userService.createUser(createUser, profilePic);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping(value = "/{id}/profile-pic", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> uploadProfilePic(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        User updatedUser = userService.updateProfilePic(id, file);
        return ResponseEntity.ok(updatedUser);
    }

    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setProfilePicUrl(user.getProfilePic() != null ? "/api/images/" + user.getProfilePic().getId() : null);
        response.setOnline(true);         // TODO: replace with real status
        response.setLastSeen("Online now"); // TODO: replace with real last seen
        return response;
    }
}
