package nl.itvitae.attendancetracker.scheduleddate;


import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.attendance.AttendanceRegistration;
import nl.itvitae.attendancetracker.attendance.AttendanceRegistrationDto;
import nl.itvitae.attendancetracker.attendance.AttendanceRegistrationRepository;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClass;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClassDto;
import nl.itvitae.attendancetracker.student.Student;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;

@RestController
@RequestMapping("dates")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173")
public class ScheduledDateController {
    private final ScheduledDateRepository scheduledDateRepository;

    private final AttendanceRegistrationRepository<AttendanceRegistration> attendanceRegistrationRepository;

    @GetMapping
    public Iterable<ScheduledDate> getAll() {
        return scheduledDateRepository.findAll();
    }

    @GetMapping("{dateAsString}")
    public ScheduledDateDto getByDate(@PathVariable String dateAsString) {
        var date = LocalDate.from(DateTimeFormatter.ISO_LOCAL_DATE.parse(dateAsString));
        var possibleDate = scheduledDateRepository.findByDate(date);
        if (possibleDate.isEmpty()) return null; // not found
        var scheduledDate = possibleDate.get();
        var attendanceRegistrations = attendanceRegistrationRepository.findByAttendanceDate(scheduledDate);
        var classes = scheduledDate.getClasses();
        var readableAttendances = attendanceRegistrations.stream().map(AttendanceRegistrationDto::from).toList();

        var classDtos = new ArrayList<ScheduledClassDto>();
        for (ScheduledClass scheduledClass : classes) {
            var group = scheduledClass.getGroup();
            var groupName = group.getName();
            var groupAttendances = new ArrayList<AttendanceRegistrationDto>();
            for (Student student : group.getMembers()) {
                var studentName = student.getName();
                groupAttendances.add(
                        readableAttendances.stream()
                                .filter(a -> a.studentName().equals(studentName))
                                .max(Comparator.comparing(AttendanceRegistrationDto::timeOfRegistration))
                                .orElse(new AttendanceRegistrationDto(null, studentName, null, "NOT REGISTERED YET", null, null)));
            }
            classDtos.add(new ScheduledClassDto(groupName, scheduledClass.getTeacher().getName(), groupAttendances));
        }
        return new ScheduledDateDto(date, classDtos);
    }
}
