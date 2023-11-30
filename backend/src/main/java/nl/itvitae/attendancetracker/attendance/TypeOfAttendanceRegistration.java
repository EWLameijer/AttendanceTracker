package nl.itvitae.attendancetracker.attendance;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.personnel.Personnel;
import nl.itvitae.attendancetracker.student.Student;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor
public class TypeOfAttendanceRegistration extends AttendanceRegistration {
    private AttendanceStatus status;

    public TypeOfAttendanceRegistration(Student student, LocalDate date, Personnel personnel, AttendanceStatus status, String note) {
        super(student, date, personnel, note);
        this.status = status;
    }

    public TypeOfAttendanceRegistration(Student student, LocalDate date, Personnel personnel, AttendanceStatus status) {
        this(student, date, personnel, status, null);
    }
}
