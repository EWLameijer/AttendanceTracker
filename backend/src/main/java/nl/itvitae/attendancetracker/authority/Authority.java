package nl.itvitae.attendancetracker.authority;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "authorities")
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Authority {
    @Id
    private String username;

    private String authority;

}
