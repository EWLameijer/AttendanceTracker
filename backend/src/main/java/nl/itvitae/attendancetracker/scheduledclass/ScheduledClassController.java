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

import java.time.LocalDate;

import static nl.itvitae.attendancetracker.Utils.parseLocalDateOrThrow;

@RestController
@RequiredArgsConstructor
@CrossOrigin("${at.cors}")
public class ScheduledClassController {
    private final ScheduledClassRepository scheduledClassRepository;

    private final GroupRepository groupRepository;

    private final PersonnelRepository personnelRepository;

    @PostMapping("/scheduled-classes")
    public ResponseEntity<String> createScheduledClass(@RequestBody ScheduledClassInputDto scheduledClassInputDto) {
        var group = groupRepository.findById(scheduledClassInputDto.groupId()).orElseThrow(() ->
                new BadRequestException("Group not found"));

        var teacher = personnelRepository.findById(scheduledClassInputDto.teacherId()).orElseThrow(() ->
                new BadRequestException("Teacher not found"));

        LocalDate localDate = parseLocalDateOrThrow(scheduledClassInputDto.dateAsString());

        if (scheduledClassRepository.findByDateAndTeacher(localDate, teacher).isEmpty()) {
            scheduledClassRepository.save(new ScheduledClass(group, teacher, localDate));

            return new ResponseEntity<>("New lesson added.", HttpStatus.CREATED);
        }

        throw new BadRequestException("Teacher already scheduled for that date.");
    }
}
