package nl.itvitae.attendancetracker.student;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("students")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173")
public class StudentController {

    private final StudentRepository studentRepository;

    @GetMapping
    public Iterable<Student> getAll() {
        return studentRepository.findAll();
    }

    @PatchMapping
    public Optional<Student> patchStudent(@RequestBody StudentDto studentDto) {
        var possibleStudent = studentRepository.findByName(studentDto.name());
        if (possibleStudent.isEmpty()) throw new IllegalArgumentException("Student unknown!");
        if (studentDto.groupId().isEmpty())

    }

}
