package nl.itvitae.attendancetracker.lesson;

import nl.itvitae.attendancetracker.attendance.attendanceregistration.AttendanceRegistrationDto;

import java.util.List;

public record LessonDto(
        String groupName,
        String teacherName,
        String dateAsString,
        List<AttendanceRegistrationDto> attendances) {
}
