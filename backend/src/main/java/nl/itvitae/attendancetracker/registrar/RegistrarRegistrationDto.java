package nl.itvitae.attendancetracker.registrar;

import java.util.UUID;

public record RegistrarRegistrationDto(UUID invitationId, String password) {
}
