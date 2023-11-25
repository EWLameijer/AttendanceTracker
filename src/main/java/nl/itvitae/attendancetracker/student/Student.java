package nl.itvitae.attendancetracker.student;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import nl.itvitae.attendancetracker.group.Group;

import java.util.UUID;

@Entity
@Getter
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @ManyToOne
    @JsonBackReference
    private Group currentGroup;

    Student() {
    }

    public Student(String name, Group currentGroup) {
        this.name = name;
        this.currentGroup = currentGroup;
        currentGroup.addMember(this);
    }
}
