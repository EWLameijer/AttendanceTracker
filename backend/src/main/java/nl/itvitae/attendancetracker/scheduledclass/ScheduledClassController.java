package nl.itvitae.attendancetracker.scheduledclass;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
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

            var teacher = personnelRepository.findById(potentialClass.teacherId()).orElseThrow(() ->
                    new BadRequestException("Teacher not found"));

            if (scheduledClassRepository.findByDateAndTeacher(localDate, teacher).isPresent()) {
                throw new BadRequestException(MessageFormat.format(
                        "{0} unavailable on {1}",
                        potentialClass.teacherId(),
                        potentialClass.dateAsString()));
            }

            var group = groupRepository.findById(potentialClass.groupId()).orElseThrow(() ->
                    new BadRequestException("Group not found"));

            validClasses.add(new ScheduledClass(group, teacher, localDate));
        }

        for (ScheduledClass validClass : validClasses) {
            scheduledClassRepository.save(validClass);
        }

        return new ResponseEntity<>(MessageFormat.format(
                "{0} classes added", (long) validClasses.size()), HttpStatus.CREATED);
    }
}
