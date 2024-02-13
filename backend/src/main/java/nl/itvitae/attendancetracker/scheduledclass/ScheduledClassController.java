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
        UUID possibleGroupUUID;
        try {
            possibleGroupUUID = UUID.fromString(scheduledClassDto.groupName());
        } catch (Exception e) {
            throw new BadRequestException("Conversion to UUID failed.");
        }
        var possibleGroup = groupRepository.findById(possibleGroupUUID);
        if (possibleGroup.isEmpty()) throw new BadRequestException("Group not found");

        UUID possiblePersonnelUUID;
        try {
            possiblePersonnelUUID = UUID.fromString(scheduledClassDto.teacherName());
        } catch (Exception e) {
            throw new BadRequestException("Conversion to UUID failed.");
        }
        var possiblePersonnel = personnelRepository.findById(possiblePersonnelUUID);
        if (possiblePersonnel.isEmpty()) throw new BadRequestException("Teacher not found");

        LocalDate date;
        try {
            date = LocalDate.parse(scheduledClassDto.dateAsString());
        } catch (Exception e) {
            throw new BadRequestException("Conversion to LocalDate failed");
        }

        ScheduledClass scheduledClass = new ScheduledClass(
                possibleGroup.get(),
                possiblePersonnel.get(),
                date
        );

        scheduledClassRepository.save(scheduledClass);

        // tijdelijke 200 status zodat ik kan kijken of het werkt
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
