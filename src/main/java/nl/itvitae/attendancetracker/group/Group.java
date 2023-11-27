package nl.itvitae.attendancetracker.group;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.student.Student;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity(name = "groups") // "group" is apparently a (Postgre)SQL statement?
@Getter
@NoArgsConstructor
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @OneToMany(mappedBy = "currentGroup")
    @JsonManagedReference
    private final Set<Student> members = new HashSet<>();

    public Group(String name) {
        this.name = name;
    }

    public void addMember(Student newMember) {
        members.add(newMember);
    }
}
