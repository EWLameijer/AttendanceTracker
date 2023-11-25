package nl.itvitae.attendancetracker.group;

import nl.itvitae.attendancetracker.attendance.AttendanceDto;

import java.util.List;

public record GroupDto(String name, List<AttendanceDto> attendances) {
}
