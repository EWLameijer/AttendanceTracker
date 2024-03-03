package nl.itvitae.attendancetracker.scheduledclass;

import java.util.UUID;

public record ScheduledClassInputDto(
        UUID groupId,
        UUID teacherId,
        String dateAsString) {
}
