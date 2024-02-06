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
    public ResponseEntity<String[]> createScheduledClass(@RequestBody String group, String personnel, String date) {
        UUID groupUUID = UUID.fromString("4175ba32-d13f-41f6-a974-c157514e7cf3");
        var possibleGroup = groupRepository.findById(groupUUID);
        if (possibleGroup.isEmpty()) throw new BadRequestException("Group not found");

        UUID personnelUUID = UUID.fromString("5029653f-1607-47c7-bea9-e5a82597641a");
        var possiblePersonnel = personnelRepository.findById(personnelUUID);
        if (possiblePersonnel.isEmpty()) throw new BadRequestException("Teacher not found");

        LocalDate ld = LocalDate.parse(date);

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
