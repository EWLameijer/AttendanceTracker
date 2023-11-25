package nl.itvitae.attendancetracker.student;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("students")
@RequiredArgsConstructor
@CrossOrigin
public class StudentController {

    private final StudentRepository studentRepository;

    @GetMapping
    public Iterable<Student> getAll() {
        return studentRepository.findAll();
    }
}
