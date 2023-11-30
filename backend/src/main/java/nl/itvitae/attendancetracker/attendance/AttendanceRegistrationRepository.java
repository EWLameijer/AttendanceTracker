package nl.itvitae.attendancetracker.attendance;

import org.springframework.data.repository.CrudRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AttendanceRegistrationRepository<T extends AttendanceRegistration> extends CrudRepository<T, UUID> {
    List<AttendanceRegistration> findByAttendanceDate(LocalDate date);

    List<AttendanceRegistration> findByAttendanceStudentId(UUID studentId);
}
