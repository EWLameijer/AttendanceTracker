package nl.itvitae.attendancetracker.lesson;

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
@RequestMapping("lessons")
public class LessonController {
    private final LessonRepository lessonRepository;

    private final GroupRepository groupRepository;

    private final TeacherRepository teacherRepository;

    @GetMapping("{id}")
    public Iterable<LessonDtoWithoutAttendance> getAllLessons(@PathVariable UUID id) {
        var group = groupRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Groep bestaat niet"));

        return lessonRepository.findAllByGroup(group).stream()
                .map(LessonDtoWithoutAttendance::from).toList();
    }

    @PostMapping
    public ResponseEntity<Iterable<LessonDtoWithoutAttendance>> createLessons(@RequestBody LessonDtoWithoutAttendance[] proposedLessons,
                                                                              UriComponentsBuilder ucb) {
        var validLessons = new ArrayList<Lesson>();

        for (LessonDtoWithoutAttendance potentialLesson : proposedLessons) {
            LocalDate localDate = parseLocalDateOrThrow(potentialLesson.dateAsString());

            var teacher = teacherRepository.findById(potentialLesson.teacherId())
                    .orElseThrow(() -> new BadRequestException("Leraar bestaat niet."));

            if (lessonRepository.findByDateAndTeacher(localDate, teacher).isPresent()) {
                throw new BadRequestException("De geselecteerde leraar is niet beschikbaar op " +
                        potentialLesson.dateAsString() + ".");
            }

            var group = findGroup(potentialLesson.groupId());

            if (lessonRepository.findByDateAndGroup(localDate, group).isPresent()) {
                throw new BadRequestException("Deze groep heeft al een les op " + potentialLesson.dateAsString() + ".");
            }

            validLessons.add(new Lesson(group, teacher, localDate));
        }

        lessonRepository.saveAll(validLessons);

        var addedLessons = validLessons.stream().map(LessonDtoWithoutAttendance::from).toList();

        URI uri = ucb.path("").buildAndExpand().toUri();

        return ResponseEntity.created(uri).body(addedLessons);
    }

    @DeleteMapping("{groupId}/{dateAsString}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID groupId, @PathVariable String dateAsString) {
        LocalDate localDate = parseLocalDateOrThrow(dateAsString);

        var group = findGroup(groupId);

        LocalDate now = LocalDate.now();

        var lessonToBeDeleted = lessonRepository.findByDateAndGroup(localDate, group).
                orElseThrow(() -> new BadRequestException("Deze les bestaat niet."));

        if (localDate.isAfter(now)) {
            lessonRepository.delete(lessonToBeDeleted);
        } else {
            throw new BadRequestException("Deze functionaliteit bestaat nog niet.");
        }
        return ResponseEntity.noContent().build();
    }

    private Group findGroup(UUID id) {
        return groupRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Groep bestaat niet."));
    }
}