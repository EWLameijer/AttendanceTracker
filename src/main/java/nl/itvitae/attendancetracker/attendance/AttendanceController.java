package nl.itvitae.attendancetracker.attendance;


import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.personnel.PersonnelRepository;
import nl.itvitae.attendancetracker.student.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

@RestController
@RequestMapping("attendances")
@CrossOrigin("http://localhost:5173")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceRegistrationService attendanceRegistrationService;

    private final StudentRepository studentRepository;

    private final PersonnelRepository personnelRepository;

    @PostMapping
    public ResponseEntity<AttendanceRegistrationDto> register(
            @RequestBody AttendanceRegistrationDto attendanceRegistrationDto,
            UriComponentsBuilder ucb
    ) {
        var possibleStudent = studentRepository.findByName(attendanceRegistrationDto.studentName());
        if (possibleStudent.isEmpty()) throw new IllegalArgumentException("No student with that name found!");
        var student = possibleStudent.get();

        var date = LocalDate.from(DateTimeFormatter.ISO_LOCAL_DATE.parse(attendanceRegistrationDto.date()));

        var possiblePersonnel = personnelRepository.findByName(attendanceRegistrationDto.personnelName());
        if (possiblePersonnel.isEmpty()) throw new IllegalArgumentException("Staff name not found");
        var personnel = possiblePersonnel.get();

        var status = attendanceRegistrationDto.status();
        var attendanceRegistration = status.contains(":") ?
                new LateAttendanceRegistration(student, date, personnel, toLocalTime(status)) :
                new TypeOfAttendanceRegistration(student, date, personnel, toStatus(status));
        attendanceRegistrationService.save(attendanceRegistration);
        URI locationOfNewReview = ucb
                .path("attendances/{id}")
                .buildAndExpand(attendanceRegistration.getId())
                .toUri();
        return ResponseEntity.created(locationOfNewReview).body(new AttendanceRegistrationDto(
                attendanceRegistration.getId(),
                attendanceRegistrationDto.studentName(),
                attendanceRegistrationDto.date(),
                attendanceRegistrationDto.status(),
                attendanceRegistrationDto.personnelName(),
                attendanceRegistration.getDateTime().toString()
        ));
    }

    private AttendanceStatus toStatus(String status) {
        return Arrays.stream(AttendanceStatus.values())
                .filter(attendanceStatus -> attendanceStatus.name().equals(status)).findFirst().orElseThrow();
    }

    private LocalTime toLocalTime(String status) {
        return LocalTime.from(DateTimeFormatter.ISO_LOCAL_TIME.parse(status + ":00"));
    }
}
