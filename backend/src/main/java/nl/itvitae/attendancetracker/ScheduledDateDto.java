package nl.itvitae.attendancetracker;

import nl.itvitae.attendancetracker.scheduledclass.ScheduledClassDto;

import java.time.LocalDate;
import java.util.List;

public record ScheduledDateDto(
        LocalDate previousDate,
        LocalDate currentDate,
        LocalDate nextDate,
        List<ScheduledClassDto> scheduledClassDtos) {
}
