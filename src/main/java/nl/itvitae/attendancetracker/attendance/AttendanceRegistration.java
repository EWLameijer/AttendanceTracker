package nl.itvitae.attendancetracker.attendance;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.itvitae.attendancetracker.personnel.Personnel;
import nl.itvitae.attendancetracker.scheduleddate.ScheduledDate;
import nl.itvitae.attendancetracker.student.Student;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Getter
public abstract class AttendanceRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    private Personnel personnel;

    private LocalDateTime dateTime;

    @ManyToOne
    @Setter
    private Attendance attendance;

    private AttendanceRegistration(Personnel personnel, Attendance attendance) {
        this.personnel = personnel;
        this.dateTime = LocalDateTime.now();
        this.attendance = attendance;
    }

    public AttendanceRegistration(Student student, ScheduledDate date, Personnel personnel) {
        this(personnel, new Attendance(student, date));
    }
}
