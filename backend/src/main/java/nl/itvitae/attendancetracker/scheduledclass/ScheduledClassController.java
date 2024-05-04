package nl.itvitae.attendancetracker.scheduledclass;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.group.GroupRepository;
import nl.itvitae.attendancetracker.personnel.PersonnelRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.text.MessageFormat;
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

    private final PersonnelRepository personnelRepository;

    @PostMapping("/scheduled-classes")
    public ResponseEntity<String> createScheduledClass(@RequestBody ScheduledClassInputDto[] listNewClasses) {
        var validClasses = new ArrayList<ScheduledClass>();

        for (ScheduledClassInputDto potentialClass : listNewClasses) {
            LocalDate localDate = parseLocalDateOrThrow(potentialClass.dateAsString());

            UUID possibleTeacher = UUID.fromString(potentialClass.teacherId());
            var teacher = personnelRepository.findById(possibleTeacher);
            if (teacher.isEmpty()) return new ResponseEntity<>("Leraar bestaat niet", HttpStatus.BAD_REQUEST);

            if (scheduledClassRepository.findByDateAndTeacher(localDate, teacher.get()).isPresent()) {
                return new ResponseEntity<>(MessageFormat.format(
                        "De geselecteerde leraar is niet beschikbaar op {0}.",
                        potentialClass.dateAsString()), HttpStatus.BAD_REQUEST);
            }

            UUID possibleGroup = UUID.fromString((potentialClass.groupId()));
            var group = groupRepository.findById(possibleGroup);
            if (group.isEmpty()) return new ResponseEntity<>("Groep bestaat niet", HttpStatus.BAD_REQUEST);

            validClasses.add(new ScheduledClass(group.get(), teacher.get(), localDate));
        }

        for (ScheduledClass validClass : validClasses) {
            scheduledClassRepository.save(validClass);
        }

        return new ResponseEntity<>(MessageFormat.format(
                "{0} lessen toegevoegd.", (long) validClasses.size()), HttpStatus.CREATED);
    }
}