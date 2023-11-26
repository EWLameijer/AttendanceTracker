package nl.itvitae.attendancetracker.attendance;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.personnel.Personnel;
import nl.itvitae.attendancetracker.scheduleddate.ScheduledDate;
import nl.itvitae.attendancetracker.student.Student;

import java.time.LocalTime;

@Entity
@Getter
@NoArgsConstructor
public class LateAttendanceRegistration extends AttendanceRegistration {
    private LocalTime arrival;

    public LateAttendanceRegistration(Student student, ScheduledDate date, Personnel personnel, LocalTime arrival) {
        super(student, date, personnel);
        this.arrival = arrival;
    }
}
