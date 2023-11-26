package nl.itvitae.attendancetracker.attendance;

import java.util.UUID;

public record AttendanceRegistrationOutputDto(UUID id, String student, String date, String status) {
}
