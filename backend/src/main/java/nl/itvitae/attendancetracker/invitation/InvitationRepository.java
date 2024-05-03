package nl.itvitae.attendancetracker.invitation;

import org.springframework.data.repository.CrudRepository;

import java.time.LocalDateTime;
import java.util.UUID;

public interface InvitationRepository extends CrudRepository<Invitation, UUID> {
    void deleteByTimeOfCreationIsBefore(LocalDateTime dateTime);

    void deleteByName(String name);
}
