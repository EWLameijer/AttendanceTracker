package nl.itvitae.attendancetracker.personnel;

import nl.itvitae.attendancetracker.group.Group;
import nl.itvitae.attendancetracker.student.StudentDto;

import java.util.List;
import java.util.UUID;

public record PersonnelDto(UUID id, String name, String role) {
    public static PersonnelDto from(Personnel personnel) {
        return new PersonnelDto(personnel.getId(), personnel.getName(), personnel.getRole().name());
    }
}
