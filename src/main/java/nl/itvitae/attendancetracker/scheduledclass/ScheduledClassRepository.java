package nl.itvitae.attendancetracker.scheduledclass;

import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface ScheduledClassRepository extends CrudRepository<ScheduledClass, UUID> {
}
