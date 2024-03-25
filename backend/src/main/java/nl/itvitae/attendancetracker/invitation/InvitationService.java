package nl.itvitae.attendancetracker.invitation;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import nl.itvitae.attendancetracker.personnel.PersonnelRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class InvitationService {
    private final InvitationRepository invitationRepository;

    private final PersonnelRepository personnelRepository;

    public void checkInvitationIsValidAndCleanExpiredInvitations(String name) {
        if (name.isEmpty()) throw new BadRequestException("Name should not be blank!");
        if (personnelRepository.existsByName(name))
            throw new BadRequestException("There is already a personnel member with this name!");
        removeAllExpiredInvitations();
        removeAllInvitationsToSamePerson(name);
    }

    private final static Duration invitationExpirationDuration = Duration.ofDays(1);

    private void removeAllExpiredInvitations() {
        var oneDayAgo = LocalDateTime.now().minus(invitationExpirationDuration);
        invitationRepository.deleteByTimeOfCreationIsBefore(oneDayAgo);
    }

    private void removeAllInvitationsToSamePerson(String name) {
        invitationRepository.deleteByName(name);
    }
}
