package nl.itvitae.attendancetracker.attendance;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.student.Student;

import java.time.LocalDate;
import java.util.UUID;


@Entity
@NoArgsConstructor
@Getter
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    private Student student;

    private LocalDate date;

    public Attendance(Student student, LocalDate date) {
        this.student = student;
        this.date = date;
    }
}
