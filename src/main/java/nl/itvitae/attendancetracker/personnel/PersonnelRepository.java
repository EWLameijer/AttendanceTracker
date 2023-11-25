package nl.itvitae.attendancetracker.personnel;

import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface PersonnelRepository extends CrudRepository<Personnel, UUID> {
}
