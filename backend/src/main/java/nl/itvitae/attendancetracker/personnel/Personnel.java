package nl.itvitae.attendancetracker.personnel;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;


// NOTE: This table "doubles" as users table for Spring Security
@Entity
@NoArgsConstructor
@Getter
public class Personnel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private String password;

    private boolean enabled = true;

    @Enumerated(EnumType.STRING)
    private ATRole role;

    public Personnel(String name, String password, ATRole role) {
        this.name = name;
        this.password = password;
        this.role = role;
    }
}
