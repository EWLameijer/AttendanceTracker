package nl.itvitae.attendancetracker.workeridentity;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import nl.itvitae.attendancetracker.authority.Authority;
import nl.itvitae.attendancetracker.authority.AuthorityRepository;
import nl.itvitae.attendancetracker.registrar.ATRole;
import nl.itvitae.attendancetracker.registrar.Registrar;
import nl.itvitae.attendancetracker.registrar.RegistrarRepository;
import nl.itvitae.attendancetracker.teacher.Teacher;
import nl.itvitae.attendancetracker.teacher.TeacherRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WorkerService {
    private final WorkerIdentityRepository workerIdentityRepository;

    private final TeacherRepository teacherRepository;

    private final PasswordEncoder passwordEncoder;

    private final RegistrarRepository registrarRepository;

    private final AuthorityRepository authorityRepository;

    public boolean nameHasBadFormatOrIsAlreadyInUse(String name) {
        return name == null || !name.trim().equals(name) || workerIdentityRepository.existsById(name);
    }

    private WorkerIdentity save(String username) {
        if (nameHasBadFormatOrIsAlreadyInUse(username)) throw new IllegalArgumentException("Name is already in use!");
        return workerIdentityRepository.save(new WorkerIdentity(username));
    }

    @Transactional
    public Registrar saveRegistrar(String username, String password, ATRole role) {
        var workerIdentity = saveOrThrow(username);
        if (role == ATRole.TEACHER) teacherRepository.save(new Teacher(workerIdentity));
        var registrar = new Registrar(workerIdentity, passwordEncoder.encode(password), role);
        registrarRepository.save(registrar);
        var authority = new Authority(username, role.asSpringSecurityRole());
        authorityRepository.save(authority);
        return registrar;
    }

    @Transactional
    public Teacher saveExternalTeacher(String name) {
        var workerIdentity = saveOrThrow(name);
        return teacherRepository.save(new Teacher(workerIdentity));
    }

    private WorkerIdentity saveOrThrow(String name) {
        if (nameHasBadFormatOrIsAlreadyInUse(name))
            throw new BadRequestException("Name has bad format or is already in use!");
        return save(name);
    }
}
