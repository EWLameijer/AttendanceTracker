package nl.itvitae.attendancetracker.scheduledclass;

import java.util.UUID;

public record ScheduledClassInputDto(
        UUID groupId,
        UUID teacherId,
        String dateAsString) {
    public static ScheduledClassInputDto from(ScheduledClass scheduledClass) {
        return new ScheduledClassInputDto(
                scheduledClass.getGroup().getId(),
                scheduledClass.getTeacher().getId(),
                scheduledClass.getDate().toString());
    }
}
