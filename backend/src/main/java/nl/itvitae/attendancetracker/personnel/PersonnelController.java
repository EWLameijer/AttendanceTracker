package nl.itvitae.attendancetracker.personnel;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.BadRequestException;
import nl.itvitae.attendancetracker.invitation.InvitationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.function.Predicate;

@RestController
@RequiredArgsConstructor
@CrossOrigin("${at.cors}")
@RequestMapping("personnel")
public class PersonnelController {
    private final PersonnelRepository personnelRepository;

    private final InvitationRepository invitationRepository;

    private final PersonnelService personnelService;

    @GetMapping("login")
    public PersonnelDto login(Principal principal) {
        return PersonnelDto.from(personnelRepository.findByNameIgnoringCase(principal.getName()).orElseThrow());
    }

    @PostMapping("register")
    @Transactional
    public ResponseEntity<PersonnelDto> register(@RequestBody PersonnelRegistrationDto registration) {
        if (!isStrongEnoughPassword(registration.password()))
            throw new BadRequestException("Password should be at least 16 characters, contain uppercase and lowercase letters, number(s) and punctuation");
        var possibleInvitation = invitationRepository.findById(registration.invitationId());
        if (possibleInvitation.isEmpty()) return ResponseEntity.notFound().build();
        var invitation = possibleInvitation.get();
        personnelService.save(invitation.getName(), registration.password(), invitation.getRole());
        invitationRepository.deleteById(registration.invitationId());
        return personnelRepository.findByNameIgnoringCase(invitation.getName()).map(PersonnelDto::from).map(ResponseEntity::ok).orElseThrow();
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
