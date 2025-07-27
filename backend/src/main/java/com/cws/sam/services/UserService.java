package com.cws.sam.services;

import com.cws.sam.dtos.LoginRequestDto;
import com.cws.sam.dtos.LoginResponseDto;
import com.cws.sam.dtos.UserRequestDto;
import com.cws.sam.exceptions.AuthenticationFailedException;
import com.cws.sam.exceptions.FaceImageProcessingException;
import com.cws.sam.exceptions.UserAlreadyExistsException;
import com.cws.sam.exceptions.UserNotFoundException;
import com.cws.sam.models.User;
import com.cws.sam.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder encoder;

    // Helper: encode image to byte[]
    private byte[] encodeFaceImage(MultipartFile faceImage) throws IOException {
        if (faceImage != null && !faceImage.isEmpty()) {
            return faceImage.getBytes();
        }
        return null;
    }

    private BufferedImage decodeFaceImage(byte[] imageBytes) throws IOException {
        if (imageBytes != null && imageBytes.length > 0) {
            try (ByteArrayInputStream bais = new ByteArrayInputStream(imageBytes)) {
                return ImageIO.read(bais);  // Reads byte array and converts it to BufferedImage
            }
        }
        return null;  // Return null if the byte array is empty or null
    }

    // Register new user (WITHOUT face image)
    public User register(UserRequestDto requestDto) {
        if (userRepository.findByUsername(requestDto.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        User user = new User();
        user.setUsername(requestDto.getUsername());
        user.setPassword(encoder.encode(requestDto.getPassword()));
        user.setRole(requestDto.getRole());
        user.setEmail(requestDto.getEmail());

        return userRepository.save(user);
    }

    // Login: verify + generate token
    public LoginResponseDto verify(LoginRequestDto loginRequestDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestDto.getEmail(), loginRequestDto.getPassword()));

            if (authentication.isAuthenticated()) {
                // Extract roles from authenticated user
                List<String> roles = authentication.getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList());

                String email = loginRequestDto.getEmail();
                User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new AuthenticationFailedException("User not found"));

                String token = jwtService.generateToken(loginRequestDto.getEmail(), roles);

                LoginResponseDto response = new LoginResponseDto();
                response.setId(user.getId());  // Hardcoded for now, you can replace it with actual user ID from DB
                response.setName(user.getUsername());  // Replace with actual user name
                response.setEmail(user.getEmail());
                response.setRole(roles.isEmpty() ? "user" : roles.get(0));  // Assuming roles list has at least one role
//                response.setAvatar(decodeFaceImage(user.getFaceImage()));  // You can adjust this to match real user info

                // Add the token to the response
                response.setToken(token);
                return response;
            } else {
                throw new AuthenticationFailedException("Invalid username or password");
            }
        } catch (AuthenticationException ex) {
            throw new AuthenticationFailedException("Invalid username or password");
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
        }
    }


    // Update user by email (with optional face image)
    public User updateByEmail(String email, UserRequestDto requestDto, MultipartFile faceImage) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        if (requestDto.getUsername() != null) {
            user.setUsername(requestDto.getUsername());
        }

        if (requestDto.getPassword() != null && !requestDto.getPassword().isEmpty()) {
            user.setPassword(encoder.encode(requestDto.getPassword()));
        }

        if (requestDto.getRole() != null) {
            user.setRole(requestDto.getRole());
        }

        try {
            byte[] faceBytes = encodeFaceImage(faceImage);
            if (faceBytes != null) {
                user.setFaceImage(faceBytes);
            }
        } catch (IOException e) {
            throw new FaceImageProcessingException("Error processing face image: " + e.getMessage());
        }

        return userRepository.save(user);
    }

    // NEW: Update only face image by email
    public User updateFaceImageByEmail(String email, MultipartFile faceImage) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        try {
            byte[] faceBytes = encodeFaceImage(faceImage);
            if (faceBytes != null) {
                user.setFaceImage(faceBytes);
            } else {
                throw new FaceImageProcessingException("Face image is empty or invalid");
            }
        } catch (IOException e) {
            throw new FaceImageProcessingException("Error processing face image: " + e.getMessage());
        }

        return userRepository.save(user);
    }
}
