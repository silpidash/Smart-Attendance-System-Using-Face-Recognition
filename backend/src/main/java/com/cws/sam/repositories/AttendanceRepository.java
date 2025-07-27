package com.cws.sam.repositories;

import com.cws.sam.models.Attendance;
import com.cws.sam.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByUserAndDate(User user, LocalDate date);
    List<Attendance> findByUser(User user);
    List<Attendance> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
    List<Attendance> findByDate(LocalDate date);

    Optional<Attendance> findByUserUsernameAndDate(String username, LocalDate today);
}
