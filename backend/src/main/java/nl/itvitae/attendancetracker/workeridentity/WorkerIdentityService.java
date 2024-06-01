package nl.itvitae.attendancetracker.workeridentity;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WorkerIdentityService {
    private final WorkerIdentityRepository workerIdentityRepository;

    public boolean nameIsAlreadyInUse(String username) {
        return workerIdentityRepository.existsById(username);
    }

    public WorkerIdentity save(String username) {
        if (nameIsAlreadyInUse(username)) throw new IllegalArgumentException("Name is already in use!");
        return workerIdentityRepository.save(new WorkerIdentity(username));
    }
}
