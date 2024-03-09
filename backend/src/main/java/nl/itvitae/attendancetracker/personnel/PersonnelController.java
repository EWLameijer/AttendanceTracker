package nl.itvitae.attendancetracker.personnel;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.stream.StreamSupport;

@RestController
@RequiredArgsConstructor
@CrossOrigin("${at.cors}")
public class PersonnelController {
    private final PersonnelRepository personnelRepository;

    @GetMapping("/teachers")
    public Iterable<PersonnelDto> getAllTeachers() {
        return StreamSupport.stream(personnelRepository.findAllByRole(ATRole.TEACHER).spliterator(), false)
                .map(PersonnelDto::from).toList();
    }

    @GetMapping("/login")
    public PersonnelDto login(Principal principal) {
        return PersonnelDto.from(personnelRepository.findByNameIgnoringCase(principal.getName()).orElseThrow());
    }
}
