package nl.itvitae.attendancetracker.personnel;

import java.util.UUID;

public record PersonnelRegistrationDto(UUID invitationId, String password) {
}
