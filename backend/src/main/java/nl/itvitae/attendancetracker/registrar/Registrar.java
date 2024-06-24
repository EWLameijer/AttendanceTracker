package nl.itvitae.attendancetracker.registrar;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.itvitae.attendancetracker.workeridentity.WorkerIdentity;

import java.util.UUID;


// NOTE: This table "doubles" as users table for Spring Security
@Entity
@NoArgsConstructor
@Getter
public class Registrar {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    private WorkerIdentity identity;

    private String password;

    private String email;

    @Setter
    private boolean enabled = true;

    private String role;

    public ATRole getRole() {
        return ATRole.valueOf(role.substring("ROLE_".length()));
    }

    public void setRole(ATRole role) {
        this.role = role.asSpringSecurityRole();
    }

    public Registrar(WorkerIdentity identity, String password, ATRole role) {
        this.identity = identity;
        this.password = password;
        setRole(role);
    }
}
