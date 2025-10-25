package NeonSquare.backend.services;

import NeonSquare.backend.dto.UserDTO;
import NeonSquare.backend.models.Image;
import NeonSquare.backend.models.User;
import NeonSquare.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ImageService imageService;

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

    public User getUser(UUID id) {
        return userRepository.findById(id).orElse(null);
    }

    @Transactional
    public User updateProfilePic(UUID userId, MultipartFile file) throws IOException {
        User user = getUser(userId);
        if (user.getProfilePic() != null) {
            Image updatedImage = imageService.updateImage(file, user.getProfilePic().getId());
            user.setProfilePic(updatedImage);
        } else {
            Image image = imageService.saveImage(file);
            user.setProfilePic(image);
        }
        return userRepository.save(user);
    }

    public List<User> findUsersByName(String name){
        return  userRepository.searchByName(name);
    }

    @Transactional
    public User updateUser(UUID userId, UserDTO userDTO) {
        User user = getUser(userId);
        
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

    public User getCurrentUserFromToken(String token) {
        // Simplified implementation - in a real app, you'd parse JWT token
        // For now, return the first user as an example
        return userRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No users found"));
    }
}
