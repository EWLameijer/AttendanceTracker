package nl.itvitae.attendancetracker.group;

import nl.itvitae.attendancetracker.student.Student;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GroupRepository extends CrudRepository<Group, UUID> {

    @Query("select e from #{#entityName} e where e.isTerminated=false")
    List<Group> findAllActive();

    Optional<Group> findByMembersContaining(Student student);

    Optional<Group> findByName(String name);
}
