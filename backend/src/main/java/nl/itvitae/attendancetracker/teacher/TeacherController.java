package nl.itvitae.attendancetracker.teacher;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import nl.itvitae.attendancetracker.workeridentity.WorkerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("teachers")
@CrossOrigin("${at.cors}")
public class TeacherController {
    private final WorkerService workerService;

    private final TeacherRepository teacherRepository;

    @PostMapping
    public ResponseEntity<TeacherDto> create(@RequestBody TeacherDto teacherDto, UriComponentsBuilder ucb) {
        var newTeacher = workerService.saveExternalTeacher(teacherDto.name());
        URI uri = ucb.path("").buildAndExpand().toUri();
        return ResponseEntity.created(uri).body(TeacherDto.from(newTeacher));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        var teacherToBeDisabled = teacherRepository.findById(id).
                orElseThrow(() -> new BadRequestException("Teacher with this id not found!"));
        teacherToBeDisabled.setCanBeScheduled(false);
        teacherRepository.save(teacherToBeDisabled);
        return ResponseEntity.noContent().build();
    }
}
