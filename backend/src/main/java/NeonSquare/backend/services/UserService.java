package NeonSquare.backend.services;

import NeonSquare.backend.models.Image;
import NeonSquare.backend.models.User;
import NeonSquare.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
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
}
