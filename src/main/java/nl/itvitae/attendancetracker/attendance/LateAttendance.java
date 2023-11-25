package nl.itvitae.attendancetracker.attendance;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.scheduledday.ScheduledDate;
import nl.itvitae.attendancetracker.student.Student;

import java.time.LocalTime;

@Entity
@Getter
@NoArgsConstructor
public class LateAttendance extends Attendance {
    private LocalTime arrival;

    public LateAttendance(Student student, ScheduledDate date, LocalTime arrival) {
        super(student, date);
        this.arrival = arrival;
    }
}
