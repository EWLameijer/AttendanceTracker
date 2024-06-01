package nl.itvitae.attendancetracker.teacher;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.workeridentity.WorkerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("teachers")
@CrossOrigin("${at.cors}")
public class TeacherController {
    private final WorkerService workerService;

    @PostMapping
    public ResponseEntity<Teacher> create(@RequestBody TeacherDto teacherDto, UriComponentsBuilder ucb) {
        var newTeacher = workerService.saveExternalTeacher(teacherDto.name());
        URI uri = ucb.path("").buildAndExpand().toUri();
        return ResponseEntity.created(uri).body(newTeacher);
    }
}
