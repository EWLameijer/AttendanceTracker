package nl.itvitae.attendancetracker.worker;

import java.util.UUID;

public record RegistrarRegistrationDto(UUID invitationId, String password) {
}
