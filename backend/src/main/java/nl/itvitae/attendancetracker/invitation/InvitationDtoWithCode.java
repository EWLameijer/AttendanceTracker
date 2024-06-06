package nl.itvitae.attendancetracker.invitation;

import java.util.UUID;

public record InvitationDtoWithCode(UUID code, String name) {
    public static InvitationDtoWithCode from(Invitation invitation) {
        return new InvitationDtoWithCode(invitation.getId(), invitation.getName());
    }
}
