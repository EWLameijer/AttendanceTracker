package nl.itvitae.attendancetracker.invitation;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import nl.itvitae.attendancetracker.registrar.RegistrarRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class InvitationService {
    private final InvitationRepository invitationRepository;

    private final RegistrarRepository registrarRepository;

    @Transactional
    public void checkInvitationIsValidAndCleanExpiredInvitations(String name) {
        if (name.isEmpty()) throw new BadRequestException("Name should not be blank!");
        
        if (registrarRepository.existsByIdentityName(name))
            throw new BadRequestException("There is already a personnel member with this name!");
        removeAllInvitationsToSamePerson(name);
    }

    private final static Duration invitationExpirationDuration = Duration.ofDays(1);

    private void removeAllInvitationsToSamePerson(String name) {
        invitationRepository.deleteByName(name);
    }

    public static boolean isExpired(Invitation invitation) {
        return invitation.getTimeOfCreation().isBefore(LocalDateTime.now().minus(invitationExpirationDuration));
    }
}
