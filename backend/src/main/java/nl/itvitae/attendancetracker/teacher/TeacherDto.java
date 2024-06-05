package nl.itvitae.attendancetracker.teacher;

import java.util.UUID;

public record TeacherDto(UUID id, String name) {
    public static TeacherDto from(Teacher teacher) {
        return new TeacherDto(teacher.getId(), teacher.getIdentity().getName());
    }
}
