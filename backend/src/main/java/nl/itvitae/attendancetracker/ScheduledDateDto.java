package nl.itvitae.attendancetracker;

import nl.itvitae.attendancetracker.scheduledclass.ScheduledClassDto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public record ScheduledDateDto(
        // putting the ID in the header may be more elegant, but is hard to make work with axios
        LocalDateTime timeOfLatestUpdate,
        Optional<LocalDate> previousDate,
        LocalDate currentDate,
        Optional<LocalDate> nextDate,
        List<ScheduledClassDto> classes) {
}
