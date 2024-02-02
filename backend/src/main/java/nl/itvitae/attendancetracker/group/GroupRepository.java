package nl.itvitae.attendancetracker.group;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface GroupRepository extends CrudRepository<Group, UUID> {

    @Query("select e from #{#entityName} e where e.isTerminated=false")
    List<Group> findAllActive();
}
