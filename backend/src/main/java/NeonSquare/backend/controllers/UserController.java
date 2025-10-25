// backend/src/main/java/NeonSquare/backend/controllers/UserController.java
package NeonSquare.backend.controllers;

import NeonSquare.backend.dto.UserDTO;
import NeonSquare.backend.models.User;
import NeonSquare.backend.services.UserService;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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

    // NEW: List all users
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDTO> dtos = users.stream().map(UserDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Create user (multipart: JSON string + optional file)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserDTO> createUser(
            @RequestParam("user") String user,
            @RequestPart(value = "profilePic", required = false) MultipartFile profilePic) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        User createUser = mapper.readValue(user, User.class);
        User savedUser = userService.createUser(createUser, profilePic);
        return ResponseEntity.ok(new UserDTO(savedUser));
    }

    // Get one by id
    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserDTO> getUser(@PathVariable UUID id) {
        User user = userService.getUser(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new UserDTO(user));
    }

    // Upload/replace profile picture
    @PostMapping(path = "/{id}/profile-pic", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserDTO> uploadProfilePic(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file) throws IOException {
        User updatedUser = userService.updateProfilePic(id, file);
        if (updatedUser == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(new UserDTO(updatedUser));
    }

    // Search by name; accepts q OR query OR name to be frontend-friendly
    @GetMapping(path = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<UserDTO>> searchUsers(
            @RequestParam(name = "q", required = false) String q,
            @RequestParam(name = "query", required = false) String query,
            @RequestParam(name = "name", required = false) String name) {
        String term = firstNonBlank(q, query, name);
        List<User> users = (term == null || term.isBlank())
                ? List.of()
                : userService.findUsersByName(term);
        List<UserDTO> dtos = users.stream().map(UserDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable UUID id, @RequestBody UserDTO userDTO) {
        User updatedUser = userService.updateUser(id, userDTO);
        if (updatedUser == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(new UserDTO(updatedUser));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        User user = userService.getCurrentUserFromToken(authorization, userIdHeader);
        return ResponseEntity.ok(new UserDTO(user));
    }

    private static String firstNonBlank(String... values) {
        for (String v : values) {
            if (v != null && !v.isBlank())
                return v;
        }
        return null;
    }

}
