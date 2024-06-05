package nl.itvitae.attendancetracker.workeridentity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Getter
public class WorkerIdentity {
    @Id
    private String name;

    public WorkerIdentity(String name) {
        this.name = name;
    }
}
