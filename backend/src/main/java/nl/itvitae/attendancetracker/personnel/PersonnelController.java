package nl.itvitae.attendancetracker.personnel;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.personnel.PersonnelRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.StreamSupport;

@RestController
@RequiredArgsConstructor
@CrossOrigin("${at.cors}")
public class PersonnelController {
    private final PersonnelRepository PersonnelRepository;

    @GetMapping("/personnel")
    public Iterable<PersonnelDto> getAll() {
        return StreamSupport.stream(PersonnelRepository.findAll().spliterator(), false)
                .map(PersonnelDto::from).toList();
    }
}
