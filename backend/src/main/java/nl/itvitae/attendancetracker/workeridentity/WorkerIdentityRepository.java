package nl.itvitae.attendancetracker.workeridentity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkerIdentityRepository extends JpaRepository<WorkerIdentity, String> {
}
