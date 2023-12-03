package nl.itvitae.attendancetracker.group;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.stream.StreamSupport;

@RestController
@RequiredArgsConstructor
@CrossOrigin("${at.cors}")
public class GroupController {
    private final GroupRepository groupRepository;

    @GetMapping("/admin-view/{adminName}/groups")
    public Iterable<GroupDto> getAll() {
        return StreamSupport.stream(groupRepository.findAll().spliterator(), false)
                .map(GroupDto::from).toList();
    }

    @PostMapping("/admin-view/{adminName}/groups")
    public ResponseEntity<GroupDto> createGroup(@RequestBody GroupDto groupDto) {
        var name = groupDto.name();
        if (name == null || name.isBlank()) throw new BadRequestException("A group requires a name!");
        var newGroup = new Group(name.trim());
        groupRepository.save(newGroup);
        return ResponseEntity.created(URI.create("")).body(GroupDto.from(newGroup));
    }
}
