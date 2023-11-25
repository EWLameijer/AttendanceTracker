package nl.itvitae.attendancetracker.attendance;

import nl.itvitae.attendancetracker.scheduledday.ScheduledDate;
import org.springframework.data.repository.CrudRepository;

import java.util.Set;
import java.util.UUID;

public interface AttendanceRepository<T extends Attendance> extends CrudRepository<T, UUID> {
    Set<Attendance> findByDate(ScheduledDate date);
}
