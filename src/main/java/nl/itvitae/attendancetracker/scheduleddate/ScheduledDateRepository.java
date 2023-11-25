package nl.itvitae.attendancetracker.scheduleddate;

import org.springframework.data.repository.CrudRepository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

public interface ScheduledDateRepository extends CrudRepository<ScheduledDate, UUID> {
    Optional<ScheduledDate> findByDate(LocalDate date);
}
