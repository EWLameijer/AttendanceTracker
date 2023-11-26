package nl.itvitae.attendancetracker.attendance;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceRegistrationService {

    private final AttendanceRepository attendanceRepository;

    private final AttendanceRegistrationRepository<AttendanceRegistration> attendanceRegistrationRepository;

    public void saveAll(List<AttendanceRegistration> attendanceRegistrations) {
        for (AttendanceRegistration attendanceRegistration : attendanceRegistrations) {
            var attendance = attendanceRegistration.getAttendance();
            var student = attendance.getStudent();
            var date = attendance.getDate();
            var possibleAttendance = attendanceRepository.findByStudentAndDate(student, date);
            var savedAttendance = possibleAttendance.orElseGet(() -> attendanceRepository.save(attendance));
            attendanceRegistration.setAttendance(savedAttendance);
            attendanceRegistrationRepository.save(attendanceRegistration);
        }
    }
}
