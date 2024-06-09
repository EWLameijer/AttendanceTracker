package nl.itvitae.attendancetracker.scheduledclass;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import nl.itvitae.attendancetracker.group.Group;
import nl.itvitae.attendancetracker.group.GroupRepository;
import nl.itvitae.attendancetracker.teacher.TeacherRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.UUID;

import static nl.itvitae.attendancetracker.Utils.parseLocalDateOrThrow;

@RestController
@RequiredArgsConstructor
@CrossOrigin("${at.cors}")
public class ScheduledClassController {
    private final ScheduledClassRepository scheduledClassRepository;

    private final GroupRepository groupRepository;

    private final TeacherRepository teacherRepository;

    @GetMapping("scheduled-classes/{id}")
    public Iterable<ScheduledClassDtoWithoutAttendance> getAllScheduledCLasses(@PathVariable UUID id) {
        var possibleGroup = groupRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Groep bestaat niet"));

        return scheduledClassRepository.findAllByGroup(possibleGroup).stream()
                .map(ScheduledClassDtoWithoutAttendance::from).toList();
    }

    @PostMapping("/scheduled-classes")
    public ResponseEntity<ArrayList<ScheduledClassDtoWithoutAttendance>> createScheduledClass(@RequestBody ScheduledClassDtoWithoutAttendance[] listNewClasses,
                                                                                              UriComponentsBuilder ucb) {
        var validClasses = new ArrayList<ScheduledClass>();

        for (ScheduledClassDtoWithoutAttendance potentialClass : listNewClasses) {
            LocalDate localDate = parseLocalDateOrThrow(potentialClass.dateAsString());

            var teacher = teacherRepository.findById(potentialClass.teacherId())
                    .orElseThrow(() -> new BadRequestException("Leraar bestaat niet."));

            if (scheduledClassRepository.findByDateAndTeacher(localDate, teacher).isPresent()) {
                throw new BadRequestException("De geselecteerde leraar is niet beschikbaar op " +
                        potentialClass.dateAsString() + ".");
            }

            var group = findGroup(potentialClass.groupId());

            if (scheduledClassRepository.findByDateAndGroup(localDate, group).isPresent()) {
                throw new BadRequestException("Deze groep heeft al een les op " + potentialClass.dateAsString() + ".");
            }

            validClasses.add(new ScheduledClass(group, teacher, localDate));
        }

        scheduledClassRepository.saveAll(validClasses);

        ArrayList<ScheduledClassDtoWithoutAttendance> addedClasses = new ArrayList<>();

        for (ScheduledClass validClass : validClasses) {
            addedClasses.add(ScheduledClassDtoWithoutAttendance.from(validClass));
        }

        URI uri = ucb.path("").buildAndExpand().toUri();

        return ResponseEntity.created(uri).body(addedClasses);
    }

    @DeleteMapping("/scheduled-classes/{groupId}/{dateAsString}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID groupId, @PathVariable String dateAsString) {
        LocalDate localDate = convertToLocalDate(dateAsString);

        var group = findGroup(groupId);

        LocalDate now = LocalDate.now();

        var scheduledClassToBeDeleted = scheduledClassRepository.findByDateAndGroup(localDate, group).
                orElseThrow(() -> new BadRequestException("Deze les bestaat niet."));

        if (localDate.isAfter(now)) {
            scheduledClassRepository.delete(scheduledClassToBeDeleted);
        } else {
            throw new BadRequestException("Deze functionaliteit bestaat nog niet.");
        }
        return ResponseEntity.noContent().build();
    }

    private Group findGroup(UUID id) {
        return groupRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Groep bestaat niet."));
    }

    private LocalDate convertToLocalDate(String dateAsString) {
        return parseLocalDateOrThrow(dateAsString);
    }
}