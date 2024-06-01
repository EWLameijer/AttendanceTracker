package nl.itvitae.attendancetracker.scheduledclass;

import java.util.UUID;

public record ScheduledClassDtoWithoutAttendance(
        UUID groupId,
        UUID teacherId,
        String dateAsString) {
    public static ScheduledClassDtoWithoutAttendance from(ScheduledClass scheduledClass) {
        return new ScheduledClassDtoWithoutAttendance(
                scheduledClass.getGroup().getId(),
                scheduledClass.getTeacher().getId(),
                scheduledClass.getDate().toString());
    }
}
