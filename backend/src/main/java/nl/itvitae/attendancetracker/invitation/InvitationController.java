package nl.itvitae.attendancetracker.invitation;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.NotFoundException;
import nl.itvitae.attendancetracker.registrar.ATRole;
import nl.itvitae.attendancetracker.registrar.RegistrarDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@RestController
@RequiredArgsConstructor
@CrossOrigin("${at.cors}")
@RequestMapping("invitations")
public class InvitationController {
    private final InvitationRepository invitationRepository;

    private final InvitationService invitationService;

    @PostMapping("for-teacher")
    public InvitationDtoWithCode getTeacherOneTimePassword(@RequestBody RegistrarDto registrarDto) {
        return getInvitationDtoWithCode(registrarDto, ATRole.TEACHER);
    }

    @PostMapping("for-coach")
    public InvitationDtoWithCode getCoachOneTimePassword(@RequestBody RegistrarDto registrarDto) {
        return getInvitationDtoWithCode(registrarDto, ATRole.COACH);
    }

    @PostMapping("for-admin")
    public InvitationDtoWithCode getAdminOneTimePassword(@RequestBody RegistrarDto registrarDto) {
        return getInvitationDtoWithCode(registrarDto, ATRole.ADMIN);
    }

    @PostMapping("for-super-admin")
    public InvitationDtoWithCode getSuperAdminOneTimePassword(@RequestBody RegistrarDto registrarDto) {
        return getInvitationDtoWithCode(registrarDto, ATRole.SUPER_ADMIN);
    }

    private InvitationDtoWithCode getInvitationDtoWithCode(RegistrarDto registrarDto, ATRole role) {
        var name = registrarDto.name().trim();
        var email = registrarDto.email().trim();
        invitationService.checkInvitationIsValidAndCleanExpiredInvitations(name, email);
        return InvitationDtoWithCode.from(invitationRepository.save(new Invitation(name, role, email)));
    }

    @GetMapping("{id}")
    public ResponseEntity<InvitationDtoWithCode> getInvitation(@PathVariable UUID id) {
        return invitationRepository.findById(id).map(InvitationDtoWithCode::from).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("{name}")
    public ResponseEntity<Void> deleteByName(@PathVariable String name) {
        var invitation = invitationRepository.findByName(name).orElseThrow(NotFoundException::new);
        invitationRepository.delete(invitation);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public Stream<InvitationDtoForOverview> getAll() {
        return StreamSupport.stream(invitationRepository.findAll().spliterator(), false).
                map(InvitationDtoForOverview::from);
    }
}
