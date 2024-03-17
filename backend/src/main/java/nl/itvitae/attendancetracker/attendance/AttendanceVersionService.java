package nl.itvitae.attendancetracker.attendance;

import lombok.Getter;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Getter
public class AttendanceVersionService {
    private LocalDateTime timeOfLatestUpdate = LocalDateTime.now();

    public void update() {
        timeOfLatestUpdate = LocalDateTime.now();
    }
}
