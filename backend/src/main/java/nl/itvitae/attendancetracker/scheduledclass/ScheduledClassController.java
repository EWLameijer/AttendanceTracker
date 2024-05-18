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

import java.time.LocalDate;
import java.util.ArrayList;

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

            var teacher = personnelRepository.findById(potentialClass.teacherId());
            if (teacher.isEmpty()) return new ResponseEntity<>("Leraar bestaat niet", HttpStatus.BAD_REQUEST);

            if (scheduledClassRepository.findByDateAndTeacher(localDate, teacher.get()).isPresent()) {
                return new ResponseEntity<>("De geselecteerde leraar is niet beschikbaar op " +
                        potentialClass.dateAsString() + ".", HttpStatus.BAD_REQUEST);
            }

            var group = groupRepository.findById(potentialClass.groupId());
            if (group.isEmpty()) return new ResponseEntity<>("Groep bestaat niet", HttpStatus.BAD_REQUEST);

            if (scheduledClassRepository.findByDateAndGroup(localDate, group.get()).isPresent()) {
                return new ResponseEntity<>(
                        "Deze groep heeft al een les op " + potentialClass.dateAsString() + ".",
                        HttpStatus.BAD_REQUEST);
            }

            validClasses.add(new ScheduledClass(group.get(), teacher.get(), localDate));
        }

        scheduledClassRepository.saveAll(validClasses);

        return new ResponseEntity<>((long) validClasses.size() + "lessen toegevoegd.", HttpStatus.CREATED);
    }
}