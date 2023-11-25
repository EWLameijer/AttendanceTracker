package nl.itvitae.attendancetracker.scheduledday;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.group.Group;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Getter
public class ScheduledDate {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private LocalDate date;

    @ManyToMany
    @JsonManagedReference
    Set<Group> presentGroups = new HashSet<>();

    public ScheduledDate(LocalDate date) {
        this.date = date;
    }

    public void addGroup(Group group) {
        presentGroups.add(group);
    }
}
