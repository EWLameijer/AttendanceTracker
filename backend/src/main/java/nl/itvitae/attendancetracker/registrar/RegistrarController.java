package nl.itvitae.attendancetracker.registrar;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import nl.itvitae.attendancetracker.invitation.InvitationRepository;
import nl.itvitae.attendancetracker.teacher.TeacherDto;
import nl.itvitae.attendancetracker.teacher.TeacherRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.function.Predicate;
import java.util.stream.Stream;

@RestController
@RequiredArgsConstructor
@CrossOrigin("${at.cors}")
@RequestMapping("personnel")
public class RegistrarController {
    private final RegistrarRepository registrarRepository;

    private final InvitationRepository invitationRepository;

    private final RegistrarService registrarService;

    private final TeacherRepository teacherRepository;

    @GetMapping("teachers")
    public Stream<TeacherDto> getAllTeachers() {
        return teacherRepository.findAll().stream().map(TeacherDto::from);
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
        registrarService.save(invitation.getName(), registration.password(), invitation.getRole());
        invitationRepository.deleteById(registration.invitationId());
        return registrarRepository.findByIdentityNameIgnoringCase(invitation.getName()).map(RegistrarDto::from).map(ResponseEntity::ok).orElseThrow();
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
