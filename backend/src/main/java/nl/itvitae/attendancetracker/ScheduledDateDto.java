package nl.itvitae.attendancetracker;

import nl.itvitae.attendancetracker.scheduledclass.ScheduledClassDto;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public record ScheduledDateDto(
        Optional<LocalDate> previousDate,
        LocalDate currentDate,
        Optional<LocalDate> nextDate,
        List<ScheduledClassDto> classes) {
}
