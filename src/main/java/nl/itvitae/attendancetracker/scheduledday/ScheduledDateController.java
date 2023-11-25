package nl.itvitae.attendancetracker.scheduledday;


import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.attendance.Attendance;
import nl.itvitae.attendancetracker.attendance.AttendanceDto;
import nl.itvitae.attendancetracker.attendance.AttendanceRepository;
import nl.itvitae.attendancetracker.group.Group;
import nl.itvitae.attendancetracker.group.GroupDto;
import nl.itvitae.attendancetracker.student.Student;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;

@RestController
@RequestMapping("days")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173")
public class ScheduledDateController {
    private final ScheduledDateRepository scheduledDateRepository;

    private final AttendanceRepository<Attendance> attendanceRepository;

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
        var attendances = attendanceRepository.findByDate(scheduledDate);
        var groups = scheduledDate.getPresentGroups().stream().sorted(Comparator.comparing(Group::getName));
        var readableAttendances = attendances.stream().map(AttendanceDto::from).toList();
        var groupDtos = groups.map(group ->
                new GroupDto(group.getName(),
                        readableAttendances.stream().filter(
                                        attendance -> group.getMembers().stream().map(Student::getName).toList().contains(attendance.name()))
                                .toList())).toList();
        return new ScheduledDateDto(date, groupDtos);
    }
}
