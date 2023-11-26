package nl.itvitae.attendancetracker.attendance;

import nl.itvitae.attendancetracker.scheduleddate.ScheduledDate;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface AttendanceRegistrationRepository<T extends AttendanceRegistration> extends CrudRepository<T, UUID> {
    List<AttendanceRegistration> findByAttendanceDate(ScheduledDate date);
}
