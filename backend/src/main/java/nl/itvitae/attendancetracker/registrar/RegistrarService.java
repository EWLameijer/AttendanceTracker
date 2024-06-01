package nl.itvitae.attendancetracker.registrar;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.authority.Authority;
import nl.itvitae.attendancetracker.authority.AuthorityRepository;
import nl.itvitae.attendancetracker.teacher.Teacher;
import nl.itvitae.attendancetracker.teacher.TeacherRepository;
import nl.itvitae.attendancetracker.workeridentity.WorkerIdentityRepository;
import nl.itvitae.attendancetracker.workeridentity.WorkerIdentityService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegistrarService {
    private final PasswordEncoder passwordEncoder;

    private final RegistrarRepository registrarRepository;

    private final AuthorityRepository authorityRepository;

    private final WorkerIdentityRepository workerIdentityRepository;

    private final WorkerIdentityService workerIdentityService;

    private final TeacherRepository teacherRepository;


    @Transactional
    public Registrar save(String username, String password, ATRole role) {
        if (workerIdentityService.nameIsAlreadyInUse(username))
            throw new IllegalArgumentException("There is already someone registered with this name!");

        var workerIdentity = workerIdentityService.save(username);
        if (role == ATRole.TEACHER) teacherRepository.save(new Teacher(workerIdentity));
        var registrar = new Registrar(workerIdentity, passwordEncoder.encode(password), role);
        registrarRepository.save(registrar);
        var authority = new Authority(username, role.asSpringSecurityRole());
        authorityRepository.save(authority);
        return registrar;
    }

    public Teacher asTeacher(Registrar registrar) {
        if (registrar.getRole() != ATRole.TEACHER) throw new IllegalArgumentException("This person is not a teacher!");
        var identity = registrar.getIdentity();
        return teacherRepository.findByIdentity(identity);
    }
}
