package nl.itvitae.attendancetracker.attendance;

import java.util.UUID;

public record AttendanceRegistrationDto(
        UUID id,
        String studentName,
        String date,
        String status,
        String personnelName,
        String timeOfRegistration,
        String note
) {
    public static AttendanceRegistrationDto from(AttendanceRegistration attendanceRegistration) {
        var by = attendanceRegistration.getPersonnel().getName();
        var registrationTime = attendanceRegistration.getDateTime();
        var studentName = attendanceRegistration.getAttendance().getStudent().getName();
        var status = switch (attendanceRegistration) {
            case LateAttendanceRegistration lateAttendance -> lateAttendance.getArrival().toString();
            case TypeOfAttendanceRegistration typeOfAttendance -> typeOfAttendance.getStatus().toString();
            default -> throw new IllegalArgumentException("Attendance type missing!");
        };
        return new AttendanceRegistrationDto(
                attendanceRegistration.getId(),
                studentName,
                attendanceRegistration.getAttendance().getDate().toString(),
                status,
                by,
                registrationTime.toString(),
                attendanceRegistration.getNote()
        );
    }
}
