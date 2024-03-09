package nl.itvitae.attendancetracker.personnel;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity(name = "users")
@NoArgsConstructor
@Getter
public class Personnel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String username;

    private String password;

    private boolean enabled = true;

    @Enumerated(EnumType.STRING)
    private ATRole role;

    public String getName() {
        // ideally: find out how I can rename username to name and still make JDBC work!
        return username;
    }

    public Personnel(String name, String password, ATRole role) {
        this.username = name;
        this.password = password;
        this.role = role;
    }
}
