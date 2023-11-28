package nl.itvitae.attendancetracker.student;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import nl.itvitae.attendancetracker.group.GroupRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("students")
@RequiredArgsConstructor
@CrossOrigin("${at.cors}")
public class StudentController {

    private final StudentRepository studentRepository;

    private final GroupRepository groupRepository;

    @GetMapping
    public Iterable<Student> getAll() {
        return studentRepository.findAll();
    }

    @PatchMapping
    public StudentDto patchStudent(@RequestBody StudentDto studentDto) {
        var possibleStudent = studentRepository.findById(studentDto.id());
        if (possibleStudent.isEmpty()) throw new BadRequestException("Student unknown!");
        if (studentDto.groupId() == null) {
            System.out.println("Removing student from group!");
            var student = possibleStudent.get();
            student.removeFromGroup();
            studentRepository.save(student);
            return StudentDto.from(student);
        }
        return studentDto;
    }

    @PostMapping
    public ResponseEntity<StudentDto> createStudent(@RequestBody StudentDto studentDto, UriComponentsBuilder ucb) {
        var possibleGroup = groupRepository.findById(studentDto.groupId());
        if (possibleGroup.isEmpty()) throw new BadRequestException("Group not found");
        var possibleStudent = studentRepository.findByNameIgnoringCase(studentDto.name());
        if (possibleStudent.isPresent()) throw new BadRequestException("A student with this name already exists!");
        var newStudent = studentRepository.save(new Student(studentDto.name(), possibleGroup.get()));
        var uri = ucb.path("students/{id}").buildAndExpand(newStudent.getId()).toUri();
        return ResponseEntity.created(uri).body(StudentDto.from(newStudent));
    }
}
