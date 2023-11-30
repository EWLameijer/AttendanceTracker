package nl.itvitae.attendancetracker.group;

import nl.itvitae.attendancetracker.student.StudentDto;

import java.util.List;
import java.util.UUID;

public record GroupDto(UUID id, String name, List<StudentDto> members) {
    public static GroupDto from(Group group) {
        var members = group.getMembers().stream().map(StudentDto::from).toList();
        return new GroupDto(group.getId(), group.getName(), members);
    }
}
