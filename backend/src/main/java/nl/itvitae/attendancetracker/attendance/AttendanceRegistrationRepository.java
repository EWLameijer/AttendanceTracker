package nl.itvitae.attendancetracker.attendance;

import org.springframework.data.repository.CrudRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AttendanceRegistrationRepository extends CrudRepository<AttendanceRegistration, UUID> {
    List<AttendanceRegistration> findByAttendanceDate(LocalDate date);

    List<AttendanceRegistration> findByAttendanceStudentId(UUID studentId);
}
