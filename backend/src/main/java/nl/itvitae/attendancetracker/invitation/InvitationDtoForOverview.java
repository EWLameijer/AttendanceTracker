package nl.itvitae.attendancetracker.invitation;

public record InvitationDtoForOverview(String name, String role, boolean hasExpired) {
    public static InvitationDtoForOverview from(Invitation invitation) {
        return new InvitationDtoForOverview(invitation.getName(), invitation.getRole().name(),
                InvitationService.isExpired(invitation));
    }
}
