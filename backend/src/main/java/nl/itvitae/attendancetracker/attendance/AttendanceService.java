package nl.itvitae.attendancetracker.attendance;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.attendance.attendanceregistration.AttendanceRegistration;
import nl.itvitae.attendancetracker.attendance.attendanceregistration.AttendanceRegistrationDto;
import nl.itvitae.attendancetracker.attendance.attendanceregistration.AttendanceRegistrationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;

    private final AttendanceRegistrationService attendanceRegistrationService;

    public void saveAll(List<AttendanceRegistrationDto> attendanceRegistrationDtos) {
        var attendances = attendanceRegistrationDtos.stream().map(this::toUpdatedAttendanceOrThrow).toList();
        attendanceRepository.saveAll(attendances);
    }

    public void save(AttendanceRegistrationDto attendanceRegistrationDto) {
        saveAll(List.of(attendanceRegistrationDto));
    }

    public Attendance toUpdatedAttendanceOrThrow(AttendanceRegistrationDto attendanceRegistrationDto) {
        var attendanceRegistrationEntities = attendanceRegistrationService.
                getValidAttendanceEntitiesOrThrow(attendanceRegistrationDto);
        var student = attendanceRegistrationEntities.student();
        var date = attendanceRegistrationEntities.date();
        var attendance = attendanceRepository.findByStudentAndDate(student, date).orElse(new Attendance(student, date));
        var registrar = attendanceRegistrationEntities.registrar();
        var status = toStatus(attendanceRegistrationDto.status());
        var note = attendanceRegistrationDto.note();
        var possibleLatestRegistrationByThisRegistrar = attendance.getLatestRegistrationBy(registrar);
        if (possibleLatestRegistrationByThisRegistrar.isPresent() &&
                possibleLatestRegistrationByThisRegistrar.get().getDateTime().isAfter(LocalDateTime.now().minusMinutes(1))) {
            var newTime = LocalDateTime.now();
            possibleLatestRegistrationByThisRegistrar.get().updateWith(status, note, newTime);
        } else {
            var attendanceRegistration = new AttendanceRegistration(attendance, registrar, status, note);
            attendance.addRegistration(attendanceRegistration);
        }
        return attendance;
    }

    private AttendanceStatus toStatus(String status) {
        return Arrays.stream(AttendanceStatus.values())
                .filter(attendanceStatus -> attendanceStatus.name().equals(status)).findFirst().orElseThrow();
    }
}