package nl.itvitae.attendancetracker.personnel;

import org.springframework.data.repository.CrudRepository;

import java.util.Optional;
import java.util.UUID;

public interface PersonnelRepository extends CrudRepository<Personnel, UUID> {
    Optional<Personnel> findByNameIgnoringCase(String name);

    Iterable<Personnel> findAllByRole(ATRole role);
}
