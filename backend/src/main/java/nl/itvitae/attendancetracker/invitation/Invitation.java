package nl.itvitae.attendancetracker.invitation;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.registrar.ATRole;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor
public class Invitation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private String email;

    private final LocalDateTime timeOfCreation = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private ATRole role;

    public Invitation(String name, ATRole role, String email) {
        this.name = name;
        this.role = role;
        this.email = email;
    }
}
