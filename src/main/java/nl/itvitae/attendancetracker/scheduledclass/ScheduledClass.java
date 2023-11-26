package nl.itvitae.attendancetracker.scheduledclass;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.group.Group;
import nl.itvitae.attendancetracker.personnel.Personnel;

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
    private Personnel teacher;

    public ScheduledClass(Group group, Personnel teacher) {
        this.group = group;
        this.teacher = teacher;
    }
}
