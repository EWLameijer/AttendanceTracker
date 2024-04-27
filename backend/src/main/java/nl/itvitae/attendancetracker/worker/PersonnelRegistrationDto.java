package nl.itvitae.attendancetracker.worker;

import java.util.UUID;

public record PersonnelRegistrationDto(UUID invitationId, String password) {
}
