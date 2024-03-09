package nl.itvitae.attendancetracker.personnel;

import org.springframework.data.repository.CrudRepository;

import java.util.Optional;
import java.util.UUID;

public interface PersonnelRepository extends CrudRepository<Personnel, UUID> {
    default Optional<Personnel> findByNameIgnoringCase(String name) {
        return findByUsernameIgnoringCase(name);
    }

    Optional<Personnel> findByUsernameIgnoringCase(String name);

    Iterable<Personnel> findAllByRole(ATRole role);
}
