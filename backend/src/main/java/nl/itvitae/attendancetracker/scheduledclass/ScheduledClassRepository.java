package nl.itvitae.attendancetracker.scheduledclass;

import nl.itvitae.attendancetracker.group.Group;
import nl.itvitae.attendancetracker.worker.Worker;
import org.springframework.data.repository.CrudRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ScheduledClassRepository extends CrudRepository<ScheduledClass, UUID> {
    List<ScheduledClass> findAllByDate(LocalDate date);

    List<ScheduledClass> findAllByGroup(Group group);

    Optional<ScheduledClass> findByDateAndTeacher(LocalDate date, Worker teacher);
}
