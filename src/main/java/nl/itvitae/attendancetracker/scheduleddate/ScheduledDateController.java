package nl.itvitae.attendancetracker.scheduleddate;


import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.attendance.AttendanceDto;
import nl.itvitae.attendancetracker.attendance.AttendanceRegistrationRepository;
import nl.itvitae.attendancetracker.group.Group;
import nl.itvitae.attendancetracker.group.GroupDto;
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

    private final AttendanceRegistrationRepository attendanceRegistrationRepository;

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
        var attendances = attendanceRegistrationRepository.findByAttendanceDate(scheduledDate);
        var groups = scheduledDate.getPresentGroups().stream().sorted(Comparator.comparing(Group::getName)).toList();
        var readableAttendances = attendances.stream().map(AttendanceDto::from).toList();

        var groupDtos = new ArrayList<GroupDto>();
        for (Group group : groups) {
            var groupName = group.getName();
            var groupAttendances = new ArrayList<AttendanceDto>();
            for (Student student : group.getMembers()) {
                var studentName = student.getName();
                groupAttendances.add(
                        readableAttendances.stream()
                                .filter(a -> a.name().equals(studentName))
                                .max(Comparator.comparing(AttendanceDto::timeOfRegistration))
                                .orElse(new AttendanceDto(studentName, "NOT REGISTERED YET", null, null)));
            }
            groupDtos.add(new GroupDto(groupName, groupAttendances));
        }
        return new ScheduledDateDto(date, groupDtos);
    }
}
