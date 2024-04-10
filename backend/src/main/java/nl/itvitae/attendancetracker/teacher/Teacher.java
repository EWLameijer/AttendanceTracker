package nl.itvitae.attendancetracker.teacher;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Getter
public class Teacher {
    @Id
    private String name;
}
