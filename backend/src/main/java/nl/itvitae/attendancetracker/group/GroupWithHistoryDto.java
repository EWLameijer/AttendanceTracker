package nl.itvitae.attendancetracker.group;

import nl.itvitae.attendancetracker.student.StudentDto;

import java.util.List;
import java.util.UUID;

public record GroupWithHistoryDto(UUID id, String name, List<StudentDto> members, boolean hasPastLessons) {
    public static GroupWithHistoryDto of(Group group, boolean hasPastLessons) {
        var groupDto = GroupDto.from(group);
        return new GroupWithHistoryDto(groupDto.id(), groupDto.name(), groupDto.members(), hasPastLessons);
    }
}
