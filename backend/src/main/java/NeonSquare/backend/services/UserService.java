// backend/src/main/java/NeonSquare/backend/services/UserService.java
package NeonSquare.backend.services;

import NeonSquare.backend.dto.UserDTO;
import NeonSquare.backend.models.Image;
import NeonSquare.backend.models.User;
import NeonSquare.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ImageService imageService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public UserService(UserRepository userRepository, ImageService imageService) {
        this.userRepository = userRepository;
        this.imageService = imageService;
    }

    @Transactional
    public User createUser(User user, MultipartFile profilePicFile) throws IOException {
        if (profilePicFile != null && !profilePicFile.isEmpty()) {
            Image image = imageService.saveImage(profilePicFile);
            user.setProfilePic(image);
        }
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User getUser(UUID id) {
        return userRepository.findById(id).orElse(null);
    }

    @Transactional
    public User updateProfilePic(UUID userId, MultipartFile file) throws IOException {
        User user = getUser(userId);
        if (user == null) return null;
        if (file == null || file.isEmpty()) {
            return user; // or throw new IllegalArgumentException("Empty file");
        }
        if (user.getProfilePic() != null) {
            Image updatedImage = imageService.updateImage(file, user.getProfilePic().getId());
            user.setProfilePic(updatedImage);
        } else {
            Image image = imageService.saveImage(file);
            user.setProfilePic(image);
        }
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<User> findUsersByName(String name){
        return userRepository.searchByName(name);
    }

    // Optional alias to keep older controllers happy (if any call searchUsers)
    @Transactional(readOnly = true)
    public List<User> searchUsers(String name) {
        return findUsersByName(name);
    }

    @Transactional
    public User updateUser(UUID userId, UserDTO userDTO) {
        User user = getUser(userId);
        if (user == null) return null;

        if (userDTO.getFirstName() != null) {
            user.setFirstName(userDTO.getFirstName());
        }
        if (userDTO.getLastName() != null) {
            user.setLastName(userDTO.getLastName());
        }
        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail());
        }

        return userRepository.save(user);
    }

    /**
     * Resolve current user from the Authorization header and/or a fallback header.
     * Supports:
     *  - Raw UUID tokens (treat token as userId)
     *  - JWT tokens (decode payload; try userId/id/sub/email)
     *  - Fallback header "X-User-Id" (controller may pass it)
     */
    public User getCurrentUserFromToken(String authorizationHeader, String fallbackUserIdHeader) {
        // 1) If header missing, try fallback header
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            return tryFindByHeaderUserId(fallbackUserIdHeader).orElseThrow(
                () -> new RuntimeException("Missing Authorization header"));
        }

        String token = authorizationHeader.trim();
        if (token.toLowerCase().startsWith("bearer ")) {
            token = token.substring(7).trim();
        }

        // 2) If token is a UUID, fetch by id
        try {
            UUID uuid = UUID.fromString(token);
            return userRepository.findById(uuid)
                .orElseThrow(() -> new RuntimeException("User not found for UUID token"));
        } catch (IllegalArgumentException ignored) {
            // not a UUID; continue
        }

        // 3) Try to parse as JWT (no signature verification — just to extract identity)
        try {
            String[] parts = token.split("\\.");
            if (parts.length >= 2) {
                String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
                JsonNode payload = objectMapper.readTree(payloadJson);

                String[] candidates = new String[] { "userId", "id", "sub", "email" };
                for (String key : candidates) {
                    if (payload.hasNonNull(key)) {
                        String val = payload.get(key).asText();

                        // Try UUID
                        try {
                            UUID uuid = UUID.fromString(val);
                            return userRepository.findById(uuid)
                                .orElseThrow(() -> new RuntimeException("User not found for JWT uuid"));
                        } catch (IllegalArgumentException ignored) {
                            // not a UUID
                        }

                        // Try email
                        User byEmail = userRepository.findByEmail(val);
                        if (byEmail != null) return byEmail;
                    }
                }
            }
        } catch (Exception ignored) {
            // fall through to fallback
        }

        // 4) Final fallback: explicit header with user id
        return tryFindByHeaderUserId(fallbackUserIdHeader).orElseThrow(
            () -> new RuntimeException("Unable to resolve user from token"));
    }

    private Optional<User> tryFindByHeaderUserId(String headerVal) {
        if (headerVal == null || headerVal.isBlank()) return Optional.empty();
        try {
            UUID id = UUID.fromString(headerVal.trim());
            return userRepository.findById(id);
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}
