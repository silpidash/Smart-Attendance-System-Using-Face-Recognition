package com.cws.sam.services;

import com.cws.sam.models.Attendance;
import com.cws.sam.models.User;
import com.cws.sam.repositories.AttendanceRepository;
import com.cws.sam.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class AttendanceService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    public void markAttendance(String username, LocalDateTime timestamp) {
        User user = userRepository.findByUsername(username).orElseThrow();
        LocalDate date = timestamp.toLocalDate();

        Attendance attendance = attendanceRepository.findByUserAndDate(user, date).orElse(null);
        if (attendance == null) {
            attendance = new Attendance(null, user, date, timestamp, null, "Present");
        } else {
            attendance.setOutTime(timestamp);
            long minutesPresent = java.time.Duration.between(attendance.getInTime(), attendance.getOutTime()).toMinutes();
            attendance.setStatus(minutesPresent >= 240 ? "Present" : "Half Day");
        }
        attendanceRepository.save(attendance);
    }

    public Attendance getTodayAttendance(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return attendanceRepository.findByUserAndDate(user, LocalDate.now()).orElse(null);
    }

}
