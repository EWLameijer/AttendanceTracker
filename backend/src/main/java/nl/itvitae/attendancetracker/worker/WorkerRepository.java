package nl.itvitae.attendancetracker.worker;

import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface WorkerRepository extends CrudRepository<Worker, String> {
    Optional<Worker> findByNameIgnoringCase(String name);

    List<Worker> findAllByEnabledAndRole(boolean isEnabled, ATRole role);
}
