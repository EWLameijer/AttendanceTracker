package nl.itvitae.attendancetracker.attendance.attendanceregistration;

import nl.itvitae.attendancetracker.attendance.AttendanceStatus;
import nl.itvitae.attendancetracker.personnel.Personnel;
import nl.itvitae.attendancetracker.student.Student;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    public static AttendanceRegistrationDto of(Student student, LocalDate date, Personnel personnel,
                                               AttendanceStatus status, String note) {
        return new AttendanceRegistrationDto(UUID.randomUUID(), student.getName(), date.toString(), status.name(),
                personnel.getName(), LocalDateTime.now().toString(), note);
    }

    public static AttendanceRegistrationDto of(Student student, LocalDate date, Personnel personnel,
                                               AttendanceStatus status) {
        return new AttendanceRegistrationDto(UUID.randomUUID(), student.getName(), date.toString(), status.name(),
                personnel.getName(), LocalDateTime.now().toString(), null);
    }
}
