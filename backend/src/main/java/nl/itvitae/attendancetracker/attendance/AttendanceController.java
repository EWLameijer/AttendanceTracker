package nl.itvitae.attendancetracker.attendance;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.personnel.PersonnelRepository;
import nl.itvitae.attendancetracker.student.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@CrossOrigin("${at.cors}")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceRegistrationService attendanceRegistrationService;

    private final AttendanceRegistrationRepository<AttendanceRegistration> attendanceRegistrationRepository;

    private final StudentRepository studentRepository;

    private final PersonnelRepository personnelRepository;

    private final AttendanceVersionService attendanceVersionService;

    @GetMapping("coach-view/students/{studentId}")
    public List<AttendanceRegistrationDto> getByStudent(@PathVariable UUID studentId) {
        var attendanceRegistrations = attendanceRegistrationRepository.findByAttendanceStudentId(studentId);
        var attendances = attendanceRegistrations.stream().map(AttendanceRegistration::getAttendance).distinct();
        return attendances.map(
                        attendance -> attendanceRegistrations.stream()
                                .filter(attendanceRegistration -> attendanceRegistration.getAttendance() == attendance)
                                .max(Comparator.comparing(AttendanceRegistration::getDateTime)))
                .flatMap(Optional::stream).map(AttendanceRegistrationDto::from).toList();
    }

    @Transactional
    @PostMapping("attendances")
    public ResponseEntity<List<AttendanceRegistrationDto>> register(
            @RequestBody AttendanceRegistrationDto[] attendanceRegistrationDtos,
            UriComponentsBuilder ucb
    ) {
        var resultingRegistrations = new ArrayList<AttendanceRegistration>();
        for (AttendanceRegistrationDto attendanceRegistrationDto : attendanceRegistrationDtos) {
            var possibleStudent = studentRepository.findByNameIgnoringCase(attendanceRegistrationDto.studentName());
            if (possibleStudent.isEmpty()) throw new IllegalArgumentException("No student with that name found!");
            var student = possibleStudent.get();

            var date = LocalDate.from(DateTimeFormatter.ISO_LOCAL_DATE.parse(attendanceRegistrationDto.date()));

            var possiblePersonnel = personnelRepository.findByNameIgnoringCase(attendanceRegistrationDto.personnelName());
            if (possiblePersonnel.isEmpty()) throw new IllegalArgumentException("Staff name not found");
            var personnel = possiblePersonnel.get();

            var status = attendanceRegistrationDto.status();
            var attendanceRegistration = status.contains(":") ?
                    new LateAttendanceRegistration(student, date, personnel, toLocalTime(status), attendanceRegistrationDto.note()) :
                    new TypeOfAttendanceRegistration(student, date, personnel, toStatus(status), attendanceRegistrationDto.note());
            attendanceRegistrationService.save(attendanceRegistration);
            resultingRegistrations.add(attendanceRegistration);
        }
        if (!resultingRegistrations.isEmpty()) attendanceVersionService.update();

        return ResponseEntity.created(URI.create("")).body(resultingRegistrations.stream().map(AttendanceRegistrationDto::from).toList());
    }

    @GetMapping("/attendances/current-version")
    public LocalDateTime getVersion() {
        return attendanceVersionService.getTimeOfLatestUpdate();
    }

    private AttendanceStatus toStatus(String status) {
        return Arrays.stream(AttendanceStatus.values())
                .filter(attendanceStatus -> attendanceStatus.name().equals(status)).findFirst().orElseThrow();
    }

    private LocalTime toLocalTime(String status) {
        return LocalTime.from(DateTimeFormatter.ISO_LOCAL_TIME.parse(status + ":00"));
    }
}
