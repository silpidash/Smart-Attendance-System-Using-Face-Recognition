package com.cws.sam.controllers;

import com.cws.sam.models.Attendance;
import com.cws.sam.services.FaceRecognitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:8080")
public class FaceRecognitionController {

    @Autowired
    private FaceRecognitionService faceRecognitionService;

    @PostMapping("/start-recognition")
    public ResponseEntity<Map<String, Object>> startRecognition(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();

        boolean started = faceRecognitionService.startRecognition(email);

        if (started) {
            response.put("success", true);
            response.put("message", "Face recognition started successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Failed to start face recognition");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/mark")
    public ResponseEntity<Map<String, Object>> markAttendance(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String timestamp = payload.get("timestamp");

        boolean marked = faceRecognitionService.markAttendance(username, timestamp);

        Map<String, Object> response = new HashMap<>();
        if (marked) {
            response.put("success", true);
            response.put("message", "Attendance marked successfully for " + username);
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Failed to mark attendance");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/stop-recognition")
    public ResponseEntity<Map<String, Object>> stopRecognition() {
        boolean stopped = faceRecognitionService.stopRecognition();

        Map<String, Object> response = new HashMap<>();
        if (stopped) {
            response.put("success", true);
            response.put("message", "Face recognition stopped successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Failed to stop face recognition");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("running", faceRecognitionService.isRunning());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkAttendance(@RequestParam String email) {
        // Call the service to check attendance
        Map<String, Object> response = faceRecognitionService.checkAttendance(email);

        // If user not found, return 404
        if (response.containsKey("message") && response.get("message").equals("User not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // Return the response with attendance data
        return ResponseEntity.ok(response);
    }
}

