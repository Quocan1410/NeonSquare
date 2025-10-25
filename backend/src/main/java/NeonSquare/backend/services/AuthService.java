package NeonSquare.backend.services;

import NeonSquare.backend.dto.AuthResponse;
import NeonSquare.backend.dto.LoginRequest;
import NeonSquare.backend.dto.RegisterRequest;
import NeonSquare.backend.models.User;
import NeonSquare.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()) != null) {
            return new AuthResponse(null, null, null, null, null, "Email already exists", false);
        }

        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);

        // Generate JWT token (simplified for now)
        String token = "jwt_token_" + savedUser.getId().toString();

        return new AuthResponse(
            token,
            savedUser.getId(),
            savedUser.getFirstName(),
            savedUser.getLastName(),
            savedUser.getEmail(),
            "Registration successful",
            true
        );
    }

    public AuthResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail());

        if (user == null) {
            return new AuthResponse(null, null, null, null, null, "User not found", false);
        }

        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(null, null, null, null, null, "Invalid password", false);
        }

        // Generate JWT token (simplified for now)
        String token = "jwt_token_" + user.getId().toString();

        return new AuthResponse(
            token,
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            "Login successful",
            true
        );
    }
}

