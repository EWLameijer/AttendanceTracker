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
        var by = attendanceRegistration.getRegistrar().getName();
        var registrationTime = attendanceRegistration.getDateTime();
        var studentName = attendanceRegistration.getAttendance().getStudent().getName();
        var attendanceDate = attendanceRegistration.getAttendance().getDate().toString();
        var status = attendanceRegistration.getStatus().toString();
        return new AttendanceRegistrationDto(
                attendanceRegistration.getId(),
                studentName,
                attendanceDate,
                status,
                by,
                registrationTime.toString(),
                attendanceRegistration.getNote()
        );
    }
}
