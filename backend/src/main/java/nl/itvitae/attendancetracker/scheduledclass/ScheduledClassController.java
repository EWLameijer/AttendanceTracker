package nl.itvitae.attendancetracker.scheduledclass;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import nl.itvitae.attendancetracker.group.GroupRepository;
import nl.itvitae.attendancetracker.personnel.PersonnelRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin("${at.cors}")
public class ScheduledClassController {
    private final ScheduledClassRepository scheduledClassRepository;

    private final GroupRepository groupRepository;

    private final PersonnelRepository personnelRepository;

    @PostMapping("/scheduledclass")
    public ResponseEntity<ScheduledClassDto> createScheduledClass(@RequestBody ScheduledClassDto scheduledClassDto) {
        UUID groupUUID = UUID.fromString(scheduledClassDto.groupName());
        var possibleGroup = groupRepository.findById(groupUUID);
        if (possibleGroup.isEmpty()) throw new BadRequestException("Group not found");

        UUID personnelUUID = UUID.fromString(scheduledClassDto.teacherName());
        var possiblePersonnel = personnelRepository.findById(personnelUUID);
        if (possiblePersonnel.isEmpty()) throw new BadRequestException("Teacher not found");

        LocalDate ld = LocalDate.parse(scheduledClassDto.dateAsString());

        ScheduledClass sc = new ScheduledClass(
                possibleGroup.get(),
                possiblePersonnel.get(),
                ld
        );

        scheduledClassRepository.save(sc);

        // tijdelijke 200 status zodat ik kan kijken of het werkt
        return new ResponseEntity<>(HttpStatus.OK);
        // testen of de namen bestaan? automappen door crudrepository?
    }
}
