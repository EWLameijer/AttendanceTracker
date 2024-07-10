package nl.itvitae.attendancetracker.group;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import nl.itvitae.attendancetracker.NotFoundException;
import nl.itvitae.attendancetracker.lesson.LessonRepository;
import nl.itvitae.attendancetracker.student.Student;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.util.UUID;
import java.util.stream.Stream;

@RestController
@RequiredArgsConstructor
@CrossOrigin("${at.cors}")
@RequestMapping("groups")
public class GroupController {
    private final GroupRepository groupRepository;

    private final LessonRepository lessonRepository;

    @GetMapping
    public Stream<GroupWithHistoryDto> getAll() {
        var today = LocalDate.now();
        return groupRepository.findAllActive().stream().map(group -> {
                    var hasPastLessons = lessonRepository.findAllByGroup(group).
                            stream().anyMatch(lesson -> lesson.getDate().isBefore(today));
                    return GroupWithHistoryDto.of(group, hasPastLessons);
                }
        );
    }

    @PostMapping
    public ResponseEntity<GroupDto> createGroup(@RequestBody GroupDto groupDto, UriComponentsBuilder ucb) {
        var name = groupDto.name();
        if (name == null || name.isBlank()) throw new BadRequestException("A group requires a name!");
        var newGroup = new Group(name.trim());
        groupRepository.save(newGroup);
        URI uri = ucb.path("groups/{id}")
                .buildAndExpand(newGroup.getId())
                .toUri();
        return ResponseEntity.created(uri).body(GroupDto.from(newGroup));
    }

    @GetMapping("{id}")
    public GroupDto getById(@PathVariable UUID id) {
        return groupRepository.findById(id).map(GroupDto::from).orElseThrow(NotFoundException::new);
    }

    @PatchMapping("{id}")
    public GroupDto changeName(@PathVariable UUID id, @RequestBody GroupDto groupDto) {
        var group = groupRepository.findById(id).orElseThrow(NotFoundException::new);
        var newName = groupDto.name();
        if (newName == null) throw new BadRequestException("A new name should be specified!");
        var formattedName = newName.trim();
        if (formattedName.isEmpty()) throw new BadRequestException("New name should not be blank!");
        if (groupRepository.findByName(formattedName).isPresent())
            throw new BadRequestException("Name is already used by another group!");
        group.setName(formattedName);
        groupRepository.save(group);
        return GroupDto.from(group);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable UUID id) {
        var groupToDelete = groupRepository.findById(id).orElseThrow();

        var lessonsWithThisGroup = lessonRepository.findAllByGroup(groupToDelete);
        if (lessonsWithThisGroup.isEmpty()) {
            // You can ONLY remove students (and the group itself) if no scheduled dates are made yet
            // need to convert set to list, else a ConcurrentModificationException occurs
            groupToDelete.getMembers().stream().toList().forEach(Student::removeFromGroup);
            groupRepository.delete(groupToDelete);
        } else {
            // the group has lessons scheduled, so soft-delete it so coaches and teachers can view history
            groupToDelete.setTerminated(true);
            groupRepository.save(groupToDelete);

            // do remove future classes, though
            var today = LocalDate.now();
            var futureLessons = lessonsWithThisGroup.stream().filter(lesson -> lesson.getDate().isAfter(today)).toList();
            lessonRepository.deleteAll(futureLessons);
        }
        return ResponseEntity.noContent().build();
    }
}
