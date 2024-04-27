package nl.itvitae.attendancetracker.scheduledclass;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.group.Group;
import nl.itvitae.attendancetracker.worker.Worker;

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
    private Worker teacher;

    private LocalDate date;

    public ScheduledClass(Group group, Worker teacher, LocalDate date) {
        this.group = group;
        this.teacher = teacher;
        this.date = date;
    }
}
