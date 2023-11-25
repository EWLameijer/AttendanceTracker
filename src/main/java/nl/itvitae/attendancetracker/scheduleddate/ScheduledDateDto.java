package nl.itvitae.attendancetracker.scheduleddate;

import nl.itvitae.attendancetracker.group.GroupDto;

import java.time.LocalDate;
import java.util.List;

public record ScheduledDateDto(LocalDate date, List<GroupDto> groups) {
}
