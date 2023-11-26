package nl.itvitae.attendancetracker.scheduledclass;

import org.springframework.data.repository.CrudRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ScheduledClassRepository extends CrudRepository<ScheduledClass, UUID> {
    List<ScheduledClass> findAllByDate(LocalDate date);
}
