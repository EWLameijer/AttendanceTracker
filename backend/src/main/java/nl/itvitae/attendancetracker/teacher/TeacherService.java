package nl.itvitae.attendancetracker.teacher;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.workeridentity.WorkerIdentityService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeacherService {
    private final TeacherRepository teacherRepository;

    private final WorkerIdentityService workerIdentityService;

    public Teacher save(String name) {
        if (workerIdentityService.nameIsAlreadyInUse(name))
            throw new IllegalArgumentException("There is already someone registered with this name!");
        var workerIdentity = workerIdentityService.save(name);
        return teacherRepository.save(new Teacher(workerIdentity));
    }
}
