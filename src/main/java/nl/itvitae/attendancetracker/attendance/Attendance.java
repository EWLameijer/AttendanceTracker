package nl.itvitae.attendancetracker.attendance;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.scheduledday.ScheduledDate;
import nl.itvitae.attendancetracker.student.Student;

import java.util.UUID;


@Entity
@NoArgsConstructor
@Getter
public abstract class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    private Student student;

    @ManyToOne
    private ScheduledDate date;

    public Attendance(Student student, ScheduledDate date) {
        this.student = student;
        this.date = date;
    }
}
