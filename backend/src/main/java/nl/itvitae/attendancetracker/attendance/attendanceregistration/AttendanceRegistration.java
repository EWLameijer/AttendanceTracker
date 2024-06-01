package nl.itvitae.attendancetracker.attendance.attendanceregistration;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.itvitae.attendancetracker.attendance.Attendance;
import nl.itvitae.attendancetracker.attendance.AttendanceStatus;
import nl.itvitae.attendancetracker.personnel.Personnel;

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

    public AttendanceRegistration(Attendance attendance, Personnel personnel, AttendanceStatus status, String note) {
        this(personnel, attendance, status, note);
    }

    public AttendanceRegistration(Attendance attendance, Personnel personnel, AttendanceStatus status) {
        this(personnel, attendance, status, null);
    }

    public void updateWith(AttendanceStatus newStatus, String newNote, LocalDateTime newTime) {
        status = newStatus;
        note = newNote;
        dateTime = newTime;
    }
}
