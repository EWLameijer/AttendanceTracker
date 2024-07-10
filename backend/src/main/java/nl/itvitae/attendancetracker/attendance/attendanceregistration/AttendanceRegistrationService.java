package nl.itvitae.attendancetracker.attendance.attendanceregistration;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.attendance.AttendanceRepository;
import nl.itvitae.attendancetracker.group.GroupRepository;
import nl.itvitae.attendancetracker.lesson.LessonRepository;
import nl.itvitae.attendancetracker.registrar.RegistrarRepository;
import nl.itvitae.attendancetracker.student.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import static nl.itvitae.attendancetracker.Utils.parseLocalDateOrThrow;

@Service
@RequiredArgsConstructor
public class AttendanceRegistrationService {

    private final AttendanceRepository attendanceRepository;

    private final AttendanceRegistrationRepository attendanceRegistrationRepository;

    private final StudentRepository studentRepository;

    private final RegistrarRepository registrarRepository;

    private final GroupRepository groupRepository;

    private final LessonRepository lessonRepository;

    public void saveAll(List<AttendanceRegistration> attendanceRegistrations) {
        for (AttendanceRegistration attendanceRegistration : attendanceRegistrations) {
            save(attendanceRegistration);
        }
    }

    public void save(AttendanceRegistration attendanceRegistration) {
        var attendance = attendanceRegistration.getAttendance();
        var student = attendance.getStudent();
        var date = attendance.getDate();
        var possibleAttendance = attendanceRepository.findByStudentAndDate(student, date);
        var savedAttendance = possibleAttendance.orElseGet(() -> attendanceRepository.save(attendance));
        attendanceRegistration.setAttendance(savedAttendance);
        attendanceRegistrationRepository.save(attendanceRegistration);
    }

    public AttendanceRegistrationEntities getValidAttendanceEntitiesOrThrow(AttendanceRegistrationDto attendanceRegistrationDto) {
        var student = studentRepository.findByNameIgnoringCase(attendanceRegistrationDto.studentName()).
                orElseThrow(() -> new IllegalArgumentException("No student with that name found!"));

        var date = parseLocalDateOrThrow(attendanceRegistrationDto.date());

        var registrar = registrarRepository.findByIdentityNameIgnoringCase(attendanceRegistrationDto.registrarName()).
                orElseThrow(() -> new IllegalArgumentException("Staff name not found"));

        var group = groupRepository.findByMembersContaining(student).orElseThrow(
                () -> new IllegalArgumentException("Student is not member of a group"));
        if (!lessonRepository.existsByDateAndGroup(date, group)) {
            throw new IllegalArgumentException("Student does not follow lessons on this date");
        }
        return new AttendanceRegistrationEntities(student, registrar, date);
    }
}

