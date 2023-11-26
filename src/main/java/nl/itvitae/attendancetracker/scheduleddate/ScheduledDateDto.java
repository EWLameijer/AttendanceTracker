package nl.itvitae.attendancetracker.scheduleddate;

import nl.itvitae.attendancetracker.scheduledclass.ScheduledClassDto;

import java.time.LocalDate;
import java.util.List;

public record ScheduledDateDto(LocalDate date, List<ScheduledClassDto> classes) {
}
