package nl.itvitae.attendancetracker.attendance;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.personnel.Personnel;
import nl.itvitae.attendancetracker.student.Student;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@NoArgsConstructor
public class LateAttendanceRegistration extends AttendanceRegistration {
    private LocalTime arrival;

    public LateAttendanceRegistration(Student student, LocalDate date, Personnel personnel, LocalTime arrival, String note) {
        super(student, date, personnel, note);
        this.arrival = arrival;
    }

    public LateAttendanceRegistration(Student student, LocalDate date, Personnel personnel, LocalTime arrival) {
        this(student, date, personnel, arrival, null);
    }
}
