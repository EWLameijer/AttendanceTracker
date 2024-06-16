package nl.itvitae.attendancetracker.invitation;

import java.time.LocalDateTime;

public record InvitationDtoForOverview(String name, String role, boolean hasExpired) {
    public static InvitationDtoForOverview from(Invitation invitation) {
        return new InvitationDtoForOverview(invitation.getName(), invitation.getRole().name(),
                invitation.getTimeOfCreation().isBefore(LocalDateTime.now().minusDays(1)));
    }
}
