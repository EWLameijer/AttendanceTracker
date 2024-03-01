package nl.itvitae.attendancetracker.scheduledclass;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import nl.itvitae.attendancetracker.group.GroupRepository;
import nl.itvitae.attendancetracker.personnel.PersonnelRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@CrossOrigin("${at.cors}")
public class ScheduledClassController {
    private final ScheduledClassRepository scheduledClassRepository;

    private final GroupRepository groupRepository;

    private final PersonnelRepository personnelRepository;

    @PostMapping("/scheduled-class")
    public ResponseEntity<ScheduledClassInputDto> createScheduledClass(@RequestBody ScheduledClassInputDto scheduledClassInputDto) {
        var possibleGroup = groupRepository.findById(scheduledClassInputDto.groupId());
        if (possibleGroup.isEmpty()) throw new BadRequestException("Group not found");

        var possiblePersonnel = personnelRepository.findById(scheduledClassInputDto.teacherId());
        if (possiblePersonnel.isEmpty()) throw new BadRequestException("Teacher not found");

        LocalDate localDate;
        try {
            localDate = LocalDate.parse(scheduledClassInputDto.dateAsString());
        } catch (Exception e) {
            throw new BadRequestException("Please provide the date in this format: \"YYYY-MM-DD\"");
        }

        if (scheduledClassRepository.findByDateAndTeacher(localDate, possiblePersonnel.get()).isEmpty()) {
            scheduledClassRepository.save(new ScheduledClass(
                    possibleGroup.get(),
                    possiblePersonnel.get(),
                    localDate
            ));
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
