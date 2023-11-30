package nl.itvitae.attendancetracker.scheduledclass;

import nl.itvitae.attendancetracker.attendance.AttendanceRegistrationDto;

import java.util.List;

public record ScheduledClassDto(
        String groupName,
        String teacherName,
        String dateAsString,
        List<AttendanceRegistrationDto> attendances) {
}
