package com.cws.sam.services;

import com.cws.sam.models.Attendance;
import com.cws.sam.models.User;
import com.cws.sam.repositories.AttendanceRepository;
import com.cws.sam.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class FaceRecognitionService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    private boolean isRunning = false;
    private final Map<String, Process> activeProcesses = new ConcurrentHashMap<>();

    @Value("${face.recognition.temp-dir:temp_faces}")
    private String tempFacesDir;

    @Value("${face.recognition.python-script:python-client/attendance_camera.py}")
    private String pythonScript;

    private void setupTempFacesDirectory() throws IOException {
        Path tempDir = Paths.get(tempFacesDir);
        if (!Files.exists(tempDir)) {
            Files.createDirectories(tempDir);
        } else {
            // Clean up existing files
            Files.list(tempDir)
                    .filter(path -> path.toString().endsWith(".jpg") || path.toString().endsWith(".png"))
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });
        }

        // Fetch all users and save their face images as files
        List<User> users = userRepository.findAll();
        for (User user : users) {
            if (user.getFaceImage() != null && user.getFaceImage().length > 0) {
                String filename = user.getUsername() + ".jpg";
                Path filePath = tempDir.resolve(filename);

                try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
                    fos.write(user.getFaceImage());
                }
            }
        }

        System.out.println("Temporary face directory setup complete with " + users.size() + " faces");
    }

    // Start face recognition using email



    public boolean startRecognition(String email) {
        try {
            stopUserRecognition(email);
            setupTempFacesDirectory();

            ProcessBuilder processBuilder = new ProcessBuilder(
                    "python",
                    pythonScript,
                    "--known_faces_dir=" + tempFacesDir,
                    "--api_endpoint=http://localhost:8081/mark"
            );

            processBuilder.directory(new File(System.getProperty("user.dir")));
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();
            activeProcesses.put(email, process);

            new Thread(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        System.out.println("Python output: " + line);
                        // Only stop if recognition is explicitly complete
                        if (line.contains("Recognition complete")) {
                            stopUserRecognition(email);
                            break;
                        }
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }).start();

            isRunning = true;
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean markAttendance(String username, String timestamp) {
        try {
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isPresent()) {
                User user = userOpt.get();

                LocalDateTime attendanceTime = timestamp != null && !timestamp.isEmpty()
                        ? LocalDateTime.parse(timestamp, DateTimeFormatter.ISO_DATE_TIME)
                        : LocalDateTime.now();

                LocalDate currentDate = attendanceTime.toLocalDate();

                Optional<Attendance> existingRecord = attendanceRepository.findByUserAndDate(user, currentDate);

                Attendance attendance;
                if (existingRecord.isPresent()) {
                    attendance = existingRecord.get();
                    attendance.setOutTime(attendanceTime);
                } else {
                    attendance = new Attendance();
                    attendance.setUser(user);
                    attendance.setDate(currentDate);
                    attendance.setInTime(attendanceTime);
                    attendance.setStatus("Present");
                }

                attendanceRepository.save(attendance);

                // Removed code that stopped all processes here
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Stop all face recognition processes
    public boolean stopRecognition() {
        for (Map.Entry<String, Process> entry : activeProcesses.entrySet()) {
            Process process = entry.getValue();
            if (process.isAlive()) {
                process.destroy();
                try {
                    boolean terminated = process.waitFor(5, java.util.concurrent.TimeUnit.SECONDS);
                    if (!terminated) {
                        process.destroyForcibly();
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    e.printStackTrace();
                }
            }
        }

        activeProcesses.clear();
        isRunning = false;

        // Clean up temporary directory
        try {
            Path tempDir = Paths.get(tempFacesDir);
            if (Files.exists(tempDir)) {
                Files.list(tempDir)
                        .filter(path -> path.toString().endsWith(".jpg") || path.toString().endsWith(".png"))
                        .forEach(path -> {
                            try {
                                Files.delete(path);
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        });
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return true;
    }

    // Stop recognition for specific email
    private void stopUserRecognition(String email) {
        Process process = activeProcesses.get(email);
        if (process != null && process.isAlive()) {
            process.destroy();
            try {
                boolean terminated = process.waitFor(5, java.util.concurrent.TimeUnit.SECONDS);
                if (!terminated) {
                    process.destroyForcibly();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                e.printStackTrace();
            }
            activeProcesses.remove(email);
        }
    }

    public boolean isRunning() {
        return isRunning;
    }

    public Map<String, Object> checkAttendance(String email) {
        Map<String, Object> response = new HashMap<>();

        // Retrieve the user by username
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            response.put("marked", false);
            response.put("message", "User not found");
            return response;
        }

        User user = userOpt.get();
        LocalDate today = LocalDate.now();

        // Check if attendance for today exists
        Optional<Attendance> todayAttendance = attendanceRepository.findByUserAndDate(user, today);

        response.put("marked", todayAttendance.isPresent());
        if (todayAttendance.isPresent()) {
            response.put("inTime", todayAttendance.get().getInTime().toString());
            if (todayAttendance.get().getOutTime() != null) {
                response.put("outTime", todayAttendance.get().getOutTime().toString());
            }
        }

        return response;
    }
}