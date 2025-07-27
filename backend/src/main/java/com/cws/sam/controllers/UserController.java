package com.cws.sam.controllers;

import com.cws.sam.dtos.LoginRequestDto;
import com.cws.sam.dtos.LoginResponseDto;
import com.cws.sam.dtos.UserRequestDto;
import com.cws.sam.models.User;
import com.cws.sam.repositories.UserRepository;
import com.cws.sam.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // Get all users
    @Operation(summary = "Get all users")
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by email
    @Operation(summary = "Get user by email")
    @GetMapping("/user")
    public ResponseEntity<User> getUserByEmail(@RequestParam("email") String email) {
        return userRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Register user (without image)
    @Operation(summary = "Register a new user")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User registered"),
            @ApiResponse(responseCode = "400", description = "Bad request")
    })
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Parameter(description = "User details", required = true)
            @RequestBody UserRequestDto userRequestDto) {

        try {
            User registeredUser = userService.register(userRequestDto);
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating user: " + e.getMessage());
        }
    }

    // Login
    @Operation(summary = "User login and get JWT token")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
        return ResponseEntity.ok(userService.verify(loginRequestDto));
    }

    // Update user (excluding image)
    @Operation(summary = "Update user by email")
    @PutMapping("/user")
    public ResponseEntity<?> updateUser(
            @RequestParam("email") String email,
            @RequestBody UserRequestDto userRequestDto) {

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User updatedUser = userService.updateByEmail(email, userRequestDto, null);
        return ResponseEntity.ok(updatedUser);
    }

    // Upload face image by email
    @Operation(summary = "Upload face image by email")
    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFaceImage(
            @RequestParam String email,
            @RequestParam("faceImage") MultipartFile faceImage) {

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            User user = optionalUser.get();
            user.setFaceImage(faceImage.getBytes());
            userRepository.save(user);
            return ResponseEntity.ok("Face image uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Error processing face image: " + e.getMessage());
        }
    }

    // Get face image
    @Operation(summary = "Get face image by email")
    @GetMapping(value = "/image", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getUserFace(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getFaceImage() != null) {
            return ResponseEntity.ok(user.get().getFaceImage());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete user
    @Operation(summary = "Delete user by email")
    @DeleteMapping("/user")
    public ResponseEntity<?> deleteUser(@RequestParam("email") String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User with email " + email + " not found");
        }
    }

}
