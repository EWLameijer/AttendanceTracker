package nl.itvitae.attendancetracker.attendance;

import nl.itvitae.attendancetracker.scheduleddate.ScheduledDate;
import nl.itvitae.attendancetracker.student.Student;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;
import java.util.UUID;

interface AttendanceRepository extends CrudRepository<Attendance, UUID> {
    Optional<Attendance> findByStudentAndDate(Student student, ScheduledDate date);
}
