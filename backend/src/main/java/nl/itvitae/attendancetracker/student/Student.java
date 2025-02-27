package nl.itvitae.attendancetracker.student;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.group.Group;

import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @ManyToOne
    @JsonBackReference
    private Group group;

    public Student(String name, Group currentGroup) {
        this.name = name;
        this.group = currentGroup;
        currentGroup.addMember(this);
    }

    public void removeFromGroup() {
        group.removeMemberById(id);
        group = null;
    }
}
