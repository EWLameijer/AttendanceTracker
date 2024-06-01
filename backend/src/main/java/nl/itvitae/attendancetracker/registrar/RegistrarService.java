package nl.itvitae.attendancetracker.registrar;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.teacher.Teacher;
import nl.itvitae.attendancetracker.teacher.TeacherRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegistrarService {
    private final TeacherRepository teacherRepository;

    public Teacher asTeacher(Registrar registrar) {
        if (registrar.getRole() != ATRole.TEACHER) throw new IllegalArgumentException("This person is not a teacher!");
        var identity = registrar.getIdentity();
        return teacherRepository.findByIdentity(identity);
    }
}
