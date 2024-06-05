package nl.itvitae.attendancetracker.attendance.attendanceregistration;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.itvitae.attendancetracker.attendance.Attendance;
import nl.itvitae.attendancetracker.attendance.AttendanceStatus;
import nl.itvitae.attendancetracker.registrar.Registrar;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class AttendanceRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    private Registrar registrar;

    private LocalDateTime dateTime;

    @ManyToOne
    @Setter
    private Attendance attendance;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;

    private String note;

    private AttendanceRegistration(Registrar registrar, Attendance attendance, AttendanceStatus status, String note) {
        this.registrar = registrar;
        this.dateTime = LocalDateTime.now();
        this.attendance = attendance;
        this.status = status;
        this.note = note;
    }

    public AttendanceRegistration(Attendance attendance, Registrar registrar, AttendanceStatus status, String note) {
        this(registrar, attendance, status, note);
    }

    public AttendanceRegistration(Attendance attendance, Registrar registrar, AttendanceStatus status) {
        this(registrar, attendance, status, null);
    }

    public void updateWith(AttendanceStatus newStatus, String newNote, LocalDateTime newTime) {
        status = newStatus;
        note = newNote;
        dateTime = newTime;
    }
}
