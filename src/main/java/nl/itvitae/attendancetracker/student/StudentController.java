package nl.itvitae.attendancetracker.student;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("students")
@RequiredArgsConstructor
@CrossOrigin("${at.cors}")
public class StudentController {

    private final StudentRepository studentRepository;

    @GetMapping
    public Iterable<Student> getAll() {
        return studentRepository.findAll();
    }

    @PatchMapping
    public ResponseEntity<StudentDto> patchStudent(@RequestBody StudentDto studentDto) {
        var possibleStudent = studentRepository.findById(studentDto.id());
        if (possibleStudent.isEmpty()) throw new BadRequestException("Student unknown!");
        if (studentDto.groupId() == null) {
            System.out.println("Removing student from group!");
            var student = possibleStudent.get();
            student.removeFromGroup();
            studentRepository.save(student);
            return ResponseEntity.ok(StudentDto.from(student));
        }
        return ResponseEntity.ok(studentDto);
    }
}
