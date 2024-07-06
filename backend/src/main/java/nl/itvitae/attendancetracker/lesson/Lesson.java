package nl.itvitae.attendancetracker.lesson;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import nl.itvitae.attendancetracker.group.Group;
import nl.itvitae.attendancetracker.teacher.Teacher;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Getter
// Lesson, could also be called Session or ScheduledClass, basically is 1 scheduled day. Using Lesson here to be
// compatible with usage in frontend.
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    private Group group;

    @ManyToOne
    private Teacher teacher;

    private LocalDate date;

    public Lesson(Group group, Teacher teacher, LocalDate date) {
        this.group = group;
        this.teacher = teacher;
        this.date = date;
    }
}
