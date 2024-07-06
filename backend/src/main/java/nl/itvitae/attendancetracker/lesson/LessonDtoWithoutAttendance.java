package nl.itvitae.attendancetracker.lesson;

import java.util.UUID;

public record LessonDtoWithoutAttendance(
        UUID groupId,
        UUID teacherId,
        String dateAsString) {
    public static LessonDtoWithoutAttendance from(Lesson lesson) {
        return new LessonDtoWithoutAttendance(
                lesson.getGroup().getId(),
                lesson.getTeacher().getId(),
                lesson.getDate().toString());
    }
}
