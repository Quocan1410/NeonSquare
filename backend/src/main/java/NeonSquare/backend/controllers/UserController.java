package NeonSquare.backend.controllers;

import NeonSquare.backend.models.User;
import NeonSquare.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<User> createUser( @RequestParam("user") String user,
                                           @RequestPart(value = "profilePic", required = false) MultipartFile profilePic) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        User createUser = mapper.readValue(user, User.class);
        User savedUser = userService.createUser(createUser, profilePic);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @PostMapping("/{id}/profile-pic")
    public ResponseEntity<User> uploadProfilePic(@PathVariable UUID id,
                                                 @RequestParam("file") MultipartFile file) throws IOException {
        User updatedUser = userService.updateProfilePic(id, file);
        return ResponseEntity.ok(updatedUser);
    }
}
