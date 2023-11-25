package nl.itvitae.attendancetracker.scheduledday;


import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.attendance.AttendanceDto;
import nl.itvitae.attendancetracker.attendance.AttendanceRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("days")
@RequiredArgsConstructor
public class ScheduledDateController {
    private final ScheduledDateRepository scheduledDayRepository;

    private final AttendanceRepository attendanceRepository;

    @GetMapping
    public Iterable<ScheduledDate> getAll() {
        return scheduledDayRepository.findAll();
    }

    @GetMapping("{dateAsString}")
    public ScheduledDateDto getByDate(@PathVariable String dateAsString) {
        var date = LocalDate.from(DateTimeFormatter.ISO_LOCAL_DATE.parse(dateAsString));
        var scheduledDate = scheduledDayRepository.findByDate(date);
        if (scheduledDate.isEmpty()) return null; // not found
        var attendances = attendanceRepository.findByDate(scheduledDate.get());
        var readableAttendances = attendances.stream().map(rawAttendance -> AttendanceDto.from(rawAttendance)).toList();
        return new ScheduledDateDto(date, readableAttendances);
    }
}
