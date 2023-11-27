package nl.itvitae.attendancetracker.group;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173")
public class GroupController {
    private final GroupRepository groupRepository;

    @GetMapping("/admin-view/{adminName}/groups")
    public Iterable<GroupDto> getAll() {
        return groupRepository.findAll();
    }
}
