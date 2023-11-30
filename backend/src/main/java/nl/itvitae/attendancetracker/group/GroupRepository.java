package nl.itvitae.attendancetracker.group;

import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface GroupRepository extends CrudRepository<Group, UUID> {
}
