package nl.itvitae.attendancetracker;

import nl.itvitae.attendancetracker.scheduledclass.ScheduledClassDto;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public record ScheduledDateDto(
        // putting the UUID in the header may be more elegant, but is hard to make work with axios
        UUID attendanceUpdateVersion,
        Optional<LocalDate> previousDate,
        LocalDate currentDate,
        Optional<LocalDate> nextDate,
        List<ScheduledClassDto> classes) {
}
