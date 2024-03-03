package nl.itvitae.attendancetracker.personnel;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@NoArgsConstructor
@Getter
public class Personnel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @Enumerated(EnumType.STRING)
    private ATRole role;

    public Personnel(String name, ATRole role) {
        this.name = name;
        this.role = role;
    }
}
