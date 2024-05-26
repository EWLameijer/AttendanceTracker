package nl.itvitae.attendancetracker.scheduledclass;

import nl.itvitae.attendancetracker.group.Group;
import nl.itvitae.attendancetracker.personnel.Personnel;
import org.springframework.data.repository.CrudRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ScheduledClassRepository extends CrudRepository<ScheduledClass, UUID> {
    List<ScheduledClass> findAllByDate(LocalDate date);

    List<ScheduledClass> findAllByGroup(Group group);

    boolean existsByDateAndGroup(LocalDate date, Group group);

    Optional<ScheduledClass> findByDateAndTeacher(LocalDate date, Personnel teacher);

    Optional<ScheduledClass> findByDateAndGroup(LocalDate date, Group group);
}
