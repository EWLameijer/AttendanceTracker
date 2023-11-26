package nl.itvitae.attendancetracker.scheduleddate;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClass;

import java.time.LocalDate;
import java.util.Collection;
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
    Set<ScheduledClass> classes = new HashSet<>();

    public ScheduledDate(LocalDate date) {
        this.date = date;
    }

    public void addClass(ScheduledClass scheduledClass) {
        classes.add(scheduledClass);
    }

    public void addClasses(Collection<ScheduledClass> scheduledClasses) {
        classes.addAll(scheduledClasses);
    }
}
