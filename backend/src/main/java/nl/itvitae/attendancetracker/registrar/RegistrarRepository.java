package nl.itvitae.attendancetracker.registrar;

import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RegistrarRepository extends CrudRepository<Registrar, UUID> {
    Optional<Registrar> findByIdentityNameIgnoringCase(String name);

    List<Registrar> findAllByEnabledTrue();

    Iterable<Registrar> findAllByRole(ATRole role);

    boolean existsByIdentityName(String name);
}
