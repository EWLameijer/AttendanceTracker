package nl.itvitae.attendancetracker.worker;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.authority.Authority;
import nl.itvitae.attendancetracker.authority.AuthorityRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final PasswordEncoder passwordEncoder;

    private final AuthorityRepository authorityRepository;

    private final WorkerRepository workerRepository;

    public Optional<Worker> createRegisteringTeacher(String name, String password) {
        return createRegistrar(name, password, ATRole.TEACHER);
    }

    public Optional<Worker> createScheduledTeacher(String name) {
        return createRegistrar(name, null, ATRole.TEACHER);
    }

    public Optional<Worker> createAdmin(String name, String password) {
        return createRegistrar(name, password, ATRole.ADMIN);
    }

    public Optional<Worker> createRegistrar(String name, String password, ATRole role) {
        return createdOrExisting(name, () -> save(name, password, role));
    }

    private Optional<Worker> createdOrExisting(String name, Supplier<Worker> workerCreator) {
        var possibleExistingTeacher = workerRepository.findByNameIgnoringCase(name);
        if (possibleExistingTeacher.isPresent()) return Optional.empty();
        return Optional.of(workerCreator.get());
    }

    @Transactional
    private Worker save(String name, String password, ATRole role) {
        var encodedPassword = password != null ? passwordEncoder.encode(password) : null;
        if (encodedPassword != null) authorityRepository.save(new Authority(name, role.asSpringSecurityRole()));
        return workerRepository.save(new Worker(name, encodedPassword, role));
    }

    public Optional<Worker> findRegistrarByNameIgnoringCase(String name) {
        var possibleRegistrar = workerRepository.findByNameIgnoringCase(name);
        return possibleRegistrar.isPresent() && possibleRegistrar.get().getPassword() != null ? possibleRegistrar : Optional.empty();
    }

    public boolean hasRegistrarByNameIgnoringCase(String name) {
        var possibleRegistrar = workerRepository.findByNameIgnoringCase(name);
        return possibleRegistrar.isPresent() && possibleRegistrar.get().getPassword() != null;
    }

    public Optional<Worker> findTeacherByNameIgnoringCase(String name) {
        var possibleTeacher = findByNameIgnoringCase(name);
        return possibleTeacher.isPresent() && possibleTeacher.get().getRole() == ATRole.TEACHER ? possibleTeacher : Optional.empty();
    }

    private Optional<Worker> findByNameIgnoringCase(String name) {
        return workerRepository.findByNameIgnoringCase(name);
    }

    public List<WorkerDto> getTeachers() {
        return workerRepository.findAllByEnabledAndRole(true, ATRole.TEACHER).stream().map(WorkerDto::from).toList();
    }
}
