package nl.itvitae.attendancetracker.teacher;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.workeridentity.WorkerIdentity;

import java.util.UUID;

@Getter
@Entity
@NoArgsConstructor
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    private WorkerIdentity identity;

    public Teacher(WorkerIdentity identity) {
        this.identity = identity;
    }

    public String getName() {
        return getIdentity().getName();
    }
}
