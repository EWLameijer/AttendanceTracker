package nl.itvitae.attendancetracker.student;

import java.util.UUID;

public record StudentDto(UUID id, String name, UUID groupId) {
    public static StudentDto from(Student student) {
        var group = student.getGroup();
        var groupId = group == null ? null : group.getId();
        return new StudentDto(student.getId(), student.getName(), groupId);
    }
}
