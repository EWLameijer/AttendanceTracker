package nl.itvitae.attendancetracker.worker;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Worker {
    @Id
    protected String name;

    private String password;

    private boolean enabled = true;

    @Enumerated(EnumType.STRING)
    private ATRole role;

    Worker(String name, String password, ATRole role) {
        this.name = name;
        this.password = password;
        this.role = role;
    }
}
