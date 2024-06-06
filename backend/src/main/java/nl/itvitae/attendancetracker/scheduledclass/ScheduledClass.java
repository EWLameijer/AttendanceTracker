package nl.itvitae.attendancetracker.scheduledclass;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.itvitae.attendancetracker.group.Group;
import nl.itvitae.attendancetracker.teacher.Teacher;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Getter
public class ScheduledClass {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    private Group group;

    @ManyToOne
    private Teacher teacher;

    private LocalDate date;

    @Setter
    private boolean deleted = false;

    public ScheduledClass(Group group, Teacher teacher, LocalDate date) {
        this.group = group;
        this.teacher = teacher;
        this.date = date;
    }
}
