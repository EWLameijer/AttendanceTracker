package nl.itvitae.attendancetracker.attendance;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.itvitae.attendancetracker.personnel.Personnel;
import nl.itvitae.attendancetracker.student.Student;

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
    private Personnel personnel;

    private LocalDateTime dateTime;

    @ManyToOne
    @Setter
    private Attendance attendance;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;

    private String note;

    private AttendanceRegistration(Personnel personnel, Attendance attendance, AttendanceStatus status, String note) {
        this.personnel = personnel;
        this.dateTime = LocalDateTime.now();
        this.attendance = attendance;
        this.status = status;
        this.note = note;
    }

    public AttendanceRegistration(Student student, LocalDate date, Personnel personnel, AttendanceStatus status, String note) {
        this(personnel, new Attendance(student, date), status, note);
    }

    public AttendanceRegistration(Student student, LocalDate date, Personnel personnel, AttendanceStatus status) {
        this(personnel, new Attendance(student, date), status, null);
    }
}
