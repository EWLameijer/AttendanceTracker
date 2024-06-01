package nl.itvitae.attendancetracker.scheduledclass;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import nl.itvitae.attendancetracker.group.GroupRepository;
import nl.itvitae.attendancetracker.personnel.PersonnelRepository;

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

    private final PersonnelRepository personnelRepository;

    @GetMapping("scheduled-classes/{id}")
    public Iterable<ScheduledClassInputDto> getAllScheduledCLasses(@PathVariable UUID id) {
        var possibleGroup = groupRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Groep bestaat niet"));

        return scheduledClassRepository.findAllByGroup(possibleGroup).stream()
                .map(ScheduledClassInputDto::from).toList();
    }

    @PostMapping("/scheduled-classes")
    public ResponseEntity<String> createScheduledClass(@RequestBody ScheduledClassInputDto[] listNewClasses,
                                                       UriComponentsBuilder ucb) {
        var validClasses = new ArrayList<ScheduledClass>();

        for (ScheduledClassInputDto potentialClass : listNewClasses) {
            LocalDate localDate = parseLocalDateOrThrow(potentialClass.dateAsString());

            var teacher = personnelRepository.findById(potentialClass.teacherId())
                    .orElseThrow(() -> new BadRequestException("Leraar bestaat niet"));

            if (scheduledClassRepository.findByDateAndTeacher(localDate, teacher).isPresent()) {
                throw new BadRequestException("De geselecteerde leraar is niet beschikbaar op " +
                        potentialClass.dateAsString() + ".");
            }

            var group = groupRepository.findById(potentialClass.groupId())
                    .orElseThrow(() -> new BadRequestException("Groep bestaat niet"));

            if (scheduledClassRepository.findByDateAndGroup(localDate, group).isPresent()) {
                throw new BadRequestException("Deze groep heeft al een les op " + potentialClass.dateAsString() + ".");
            }

            validClasses.add(new ScheduledClass(group, teacher, localDate));
        }

        scheduledClassRepository.saveAll(validClasses);

        URI uri = ucb.path("").buildAndExpand().toUri();
        return ResponseEntity.created(uri).body(validClasses.size() + " lessen toegevoegd.");
    }
}