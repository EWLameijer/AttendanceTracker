package nl.itvitae.attendancetracker.group;

import nl.itvitae.attendancetracker.attendance.AttendanceRegistrationDto;

import java.util.List;

public record GroupDto(String name, List<AttendanceRegistrationDto> attendances) {
}
