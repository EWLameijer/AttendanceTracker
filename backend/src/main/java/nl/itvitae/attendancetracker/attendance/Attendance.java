package nl.itvitae.attendancetracker.attendance;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.attendance.attendanceregistration.AttendanceRegistration;
import nl.itvitae.attendancetracker.registrar.Registrar;
import nl.itvitae.attendancetracker.student.Student;

import java.time.LocalDate;
import java.util.*;


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

    @OneToMany(mappedBy = "attendance", cascade = CascadeType.ALL)
    private final Set<AttendanceRegistration> registrations = new HashSet<>();

    public Attendance(Student student, LocalDate date) {
        this.student = student;
        this.date = date;
    }

    public Optional<AttendanceRegistration> getLatestRegistrationBy(Registrar registrar) {
        return registrations.stream().filter(registration -> registration.getRegistrar().getId() == registrar.getId()).
                max(Comparator.comparing(AttendanceRegistration::getDateTime));
    }

    public void addRegistration(AttendanceRegistration registration) {
        registrations.add(registration);
    }
}
