package nl.itvitae.attendancetracker.attendance;

import nl.itvitae.attendancetracker.scheduleddate.ScheduledDate;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface AttendanceRegistrationRepository extends CrudRepository<AttendanceRegistration, UUID> {
    List<AttendanceRegistration> findByAttendanceDate(ScheduledDate date);
}
