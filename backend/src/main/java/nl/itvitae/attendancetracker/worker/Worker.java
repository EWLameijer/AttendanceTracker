package nl.itvitae.attendancetracker.worker;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
public class Worker {
    @Id
    private String name;
}
