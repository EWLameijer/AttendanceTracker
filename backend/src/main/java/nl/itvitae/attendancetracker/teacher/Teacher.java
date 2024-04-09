package nl.itvitae.attendancetracker.teacher;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
public class Teacher {
    @Id
    private String name;
}
