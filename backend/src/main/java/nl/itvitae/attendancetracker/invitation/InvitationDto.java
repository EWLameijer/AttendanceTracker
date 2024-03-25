package nl.itvitae.attendancetracker.invitation;

import java.util.UUID;

public record InvitationDto(UUID code, String name) {
    public static InvitationDto from(Invitation invitation) {
        return new InvitationDto(invitation.getId(), invitation.getName());
    }
}
