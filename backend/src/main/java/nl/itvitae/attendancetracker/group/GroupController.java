package nl.itvitae.attendancetracker.group;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import nl.itvitae.attendancetracker.scheduledclass.ScheduledClassRepository;
import nl.itvitae.attendancetracker.student.Student;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin("${at.cors}")
@RequestMapping("admin-view")
public class GroupController {
    private final GroupRepository groupRepository;

    private final ScheduledClassRepository scheduledClassRepository;

    @GetMapping
    public Iterable<GroupDto> getAll() {
        return groupRepository.findAllActive().stream().map(GroupDto::from).toList();
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
    public ResponseEntity<GroupDto> getById(@PathVariable UUID id) {
        var possibleGroup = groupRepository.findById(id);
        return possibleGroup.map(group -> ResponseEntity.ok(GroupDto.from(group))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable UUID id) {
        var groupToDelete = groupRepository.findById(id).orElseThrow();

        var scheduledClassesWithThisGroup = scheduledClassRepository.findAllByGroup(groupToDelete);
        if (scheduledClassesWithThisGroup.isEmpty()) {
            // You can ONLY remove students (and the group itself) if no scheduled dates are made yet
            // need to convert set to list, else a ConcurrentModificationException occurs
            groupToDelete.getMembers().stream().toList().forEach(Student::removeFromGroup);
            groupRepository.delete(groupToDelete);
        } else {
            // the group has scheduled classes, so soft-delete it so coaches and teachers can view history
            groupToDelete.setTerminated(true);
            groupRepository.save(groupToDelete);
        }
        return ResponseEntity.noContent().build();
    }
}
