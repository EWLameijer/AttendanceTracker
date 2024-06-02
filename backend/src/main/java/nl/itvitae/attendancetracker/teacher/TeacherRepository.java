package nl.itvitae.attendancetracker.teacher;

import nl.itvitae.attendancetracker.workeridentity.WorkerIdentity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TeacherRepository extends JpaRepository<Teacher, UUID> {
    Teacher findByIdentity(WorkerIdentity identity);

    List<Teacher> findAllByCanBeScheduledTrue();
}
