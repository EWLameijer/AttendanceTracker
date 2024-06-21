package nl.itvitae.attendancetracker.registrar;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import nl.itvitae.attendancetracker.invitation.InvitationRepository;
import nl.itvitae.attendancetracker.teacher.TeacherDto;
import nl.itvitae.attendancetracker.teacher.TeacherRepository;
import nl.itvitae.attendancetracker.workeridentity.WorkerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;
import java.util.function.Predicate;
import java.util.stream.Stream;

@RestController
@RequiredArgsConstructor
@CrossOrigin("${at.cors}")
@RequestMapping("personnel")
public class RegistrarController {
    private final RegistrarRepository registrarRepository;

    private final InvitationRepository invitationRepository;

    private final WorkerService workerService;

    private final TeacherRepository teacherRepository;

    @GetMapping("teachers")
    public Stream<TeacherDto> getAllTeachers() {
        return teacherRepository.findAllByCanBeScheduledTrue().stream().map(TeacherDto::from);
    }

    @GetMapping
    public Stream<RegistrarDto> getAll() {
        return registrarRepository.findAllByEnabledTrue().stream().map(RegistrarDto::from);
    }

    @GetMapping("login")
    public RegistrarDto login(Principal principal) {
        return RegistrarDto.from(registrarRepository.findByIdentityNameIgnoringCase(principal.getName()).orElseThrow());
    }

    @PostMapping("register")
    @Transactional
    public ResponseEntity<RegistrarDto> register(@RequestBody RegistrarRegistrationDto registration) {
        if (!isStrongEnoughPassword(registration.password()))
            throw new BadRequestException("Password should be at least 16 characters, contain uppercase and lowercase letters, number(s) and punctuation");
        var possibleInvitation = invitationRepository.findById(registration.invitationId());
        if (possibleInvitation.isEmpty()) return ResponseEntity.notFound().build();
        var invitation = possibleInvitation.get();
        workerService.saveRegistrar(invitation.getName(), registration.password(), invitation.getRole());
        invitationRepository.deleteById(registration.invitationId());
        return registrarRepository.findByIdentityNameIgnoringCase(invitation.getName()).map(RegistrarDto::from).map(ResponseEntity::ok).orElseThrow();
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        var registrarToBeDisabled = registrarRepository.findById(id).
                orElseThrow(() -> new BadRequestException("Registrar with this id not found!"));
        registrarToBeDisabled.setEnabled(false);
        registrarRepository.save(registrarToBeDisabled);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("{id}")
    public RegistrarDto changeRole(@PathVariable UUID id, @RequestBody RegistrarDto registrarDto, Principal principal) {
        var registrarToChangeRole = registrarRepository.findById(id).
                orElseThrow(() -> new BadRequestException("Registrar with this id not found!"));
        if (principal.getName().equals(registrarToChangeRole.getIdentity().getName()))
            throw new BadRequestException("You cannot change your own role!");
        registrarToChangeRole.setRole(ATRole.valueOf(registrarDto.role()));
        return RegistrarDto.from(registrarRepository.save(registrarToChangeRole));
    }

    private boolean isStrongEnoughPassword(String password) {
        var isLongEnough = password.length() >= 16;
        var containsUpperCase = containsAny(password, Character::isUpperCase);
        var containsLowerCase = containsAny(password, Character::isLowerCase);
        var containsDigit = containsAny(password, Character::isDigit);
        var containsPunctuation = containsAny(password, (ch -> "`~!@#$%^&*()-_+={[}]:;\"'|\\<,>.?/".contains("" + ch)));
        return isLongEnough && containsUpperCase && containsLowerCase && containsDigit && containsPunctuation;
    }

    private boolean containsAny(String text, Predicate<Character> condition) {
        return text.chars().anyMatch(i -> condition.test((char) i));
    }
}
