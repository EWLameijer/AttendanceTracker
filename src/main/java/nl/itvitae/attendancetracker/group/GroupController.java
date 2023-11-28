package nl.itvitae.attendancetracker.group;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
