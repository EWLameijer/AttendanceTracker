package nl.itvitae.attendancetracker.attendance;

import lombok.Getter;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Getter
public class AttendanceVersionService {
    private UUID attendanceVersionUUID = UUID.randomUUID();

    public void update() {
        attendanceVersionUUID = UUID.randomUUID();
    }
}
