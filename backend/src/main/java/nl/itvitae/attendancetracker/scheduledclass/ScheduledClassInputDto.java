package nl.itvitae.attendancetracker.scheduledclass;

public record ScheduledClassInputDto(
        String groupId,
        String teacherId,
        String dateAsString) {
}
