package nl.itvitae.attendancetracker.attendance;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.itvitae.attendancetracker.student.Student;
import nl.itvitae.attendancetracker.worker.Worker;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Getter
public class AttendanceRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    private Worker registrar;

    private LocalDateTime dateTime;

    @ManyToOne
    @Setter
    private Attendance attendance;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;

    private String note;

    private AttendanceRegistration(Worker registrar, Attendance attendance, AttendanceStatus status, String note) {
        this.registrar = registrar;
        this.dateTime = LocalDateTime.now();
        this.attendance = attendance;
        this.status = status;
        this.note = note;
    }

    public AttendanceRegistration(Student student, LocalDate date, Worker registrar, AttendanceStatus status, String note) {
        this(registrar, new Attendance(student, date), status, note);
    }

    public AttendanceRegistration(Student student, LocalDate date, Worker registrar, AttendanceStatus status) {
        this(registrar, new Attendance(student, date), status, null);
    }
}
