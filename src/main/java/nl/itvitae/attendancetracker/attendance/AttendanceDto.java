package nl.itvitae.attendancetracker.attendance;

import java.time.LocalDateTime;

public record AttendanceDto(String name, String status, String by, LocalDateTime timeOfRegistration) {
    public static AttendanceDto from(AttendanceRegistration attendanceRegistration) {
        var by = attendanceRegistration.getPersonnel().getName();
        var registrationTime = attendanceRegistration.getDateTime();
        var studentName = attendanceRegistration.getAttendance().getStudent().getName();
        var status = switch (attendanceRegistration) {
            case LateAttendanceRegistration lateAttendance -> lateAttendance.getArrival().toString();
            case TypeOfAttendanceRegistration typeOfAttendance -> typeOfAttendance.getStatus().toString();
            default -> throw new IllegalArgumentException("Attendance type missing!");
        };
        return new AttendanceDto(studentName, status, by, registrationTime);
    }
}
