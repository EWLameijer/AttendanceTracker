package nl.itvitae.attendancetracker.registrar;

import java.util.UUID;

public record RegistrarDto(UUID id, String name, String role) {
    public static RegistrarDto from(Registrar registrar) {
        return new RegistrarDto(registrar.getId(), registrar.getIdentity().getName(), registrar.getRole().name());
    }
}
