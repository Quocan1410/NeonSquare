package NeonSquare.backend.controllers;

import NeonSquare.backend.dto.UserResponse;
import NeonSquare.backend.models.User;
import NeonSquare.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
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
    public ResponseEntity<List<UserResponse>> searchUsers(@RequestParam String query) {
        List<User> users = userService.searchUsers(query);
        List<UserResponse> userResponses = users.stream()
            .map(this::convertToUserResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(userResponses);
    }

    @PostMapping
    public ResponseEntity<User> createUser( @RequestParam("user") String user,
                                           @RequestPart(value = "profilePic", required = false) MultipartFile profilePic) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        User createUser = mapper.readValue(user, User.class);
        User savedUser = userService.createUser(createUser, profilePic);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/{id}/profile-pic")
    public ResponseEntity<User> uploadProfilePic(@PathVariable UUID id,
                                                 @RequestParam("file") MultipartFile file) throws IOException {
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
        response.setOnline(true); // TODO: Implement real online status
        response.setLastSeen("Online now"); // TODO: Implement real last seen
        return response;
    }
}
