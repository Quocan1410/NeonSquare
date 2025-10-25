package NeonSquare.backend.controllers;

import NeonSquare.backend.dto.UserDTO;
import NeonSquare.backend.models.User;
import NeonSquare.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestParam("user") String user,
                                              @RequestPart(value = "profilePic", required = false) MultipartFile profilePic) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        User createUser = mapper.readValue(user, User.class);
        User savedUser = userService.createUser(createUser, profilePic);
        return ResponseEntity.ok(new UserDTO(savedUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable UUID id) {
        User user = userService.getUser(id);
        return ResponseEntity.ok(new UserDTO(user));
    }

    @PostMapping("/{id}/profile-pic")
    public ResponseEntity<UserDTO> uploadProfilePic(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        User updatedUser = userService.updateProfilePic(id, file);
        return ResponseEntity.ok(new UserDTO(updatedUser));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsersByName(@RequestParam("name") String name) {
        List<User> users = userService.findUsersByName(name);
        List<UserDTO> dtos = users.stream().map(UserDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable UUID id, @RequestBody UserDTO userDTO) {
        User updatedUser = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(new UserDTO(updatedUser));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@RequestHeader("Authorization") String token) {
        // Extract user ID from token (simplified for now)
        // In a real app, you'd validate the JWT token and extract user info
        User user = userService.getCurrentUserFromToken(token);
        return ResponseEntity.ok(new UserDTO(user));
    }
}
