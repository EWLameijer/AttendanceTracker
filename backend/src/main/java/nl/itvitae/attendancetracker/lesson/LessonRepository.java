package nl.itvitae.attendancetracker.lesson;

import nl.itvitae.attendancetracker.group.Group;
import nl.itvitae.attendancetracker.teacher.Teacher;
import org.springframework.data.repository.CrudRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LessonRepository extends CrudRepository<Lesson, UUID> {
    List<Lesson> findAllByDate(LocalDate date);

    List<Lesson> findAllByGroup(Group group);

    boolean existsByDateAndGroup(LocalDate date, Group group);

    Optional<Lesson> findByDateAndTeacher(LocalDate date, Teacher teacher);

    Optional<Lesson> findByDateAndGroup(LocalDate date, Group group);
}
