package nl.itvitae.attendancetracker.invitation;

import lombok.RequiredArgsConstructor;
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
    public InvitationDtoWithCode getTeacherOneTimePassword(@RequestBody RegistrarDto personnelDto) {
        var name = personnelDto.name().trim();
        invitationService.checkInvitationIsValidAndCleanExpiredInvitations(name);
        return InvitationDtoWithCode.from(invitationRepository.save(new Invitation(name, ATRole.TEACHER)));
    }

    @PostMapping("for-coach-or-admin")
    public InvitationDtoWithCode getCoachOrAdminOneTimePassword(@RequestBody RegistrarDto personnelDto) {
        var name = personnelDto.name().trim();
        invitationService.checkInvitationIsValidAndCleanExpiredInvitations(name);
        return InvitationDtoWithCode.from(invitationRepository.save(new Invitation(name, ATRole.ADMIN)));
    }

    @GetMapping("{id}")
    public ResponseEntity<InvitationDtoWithCode> getInvitation(@PathVariable UUID id) {
        return invitationRepository.findById(id).map(InvitationDtoWithCode::from).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public Stream<InvitationDtoForOverview> getAll() {
        return StreamSupport.stream(invitationRepository.findAll().spliterator(), false).
                map(InvitationDtoForOverview::from);
    }
}
