package nl.itvitae.attendancetracker.scheduledday;

import nl.itvitae.attendancetracker.attendance.AttendanceDto;

import java.time.LocalDate;
import java.util.List;

public record ScheduledDateDto(LocalDate date, List<AttendanceDto> attendances) {
}
