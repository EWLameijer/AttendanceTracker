package nl.itvitae.attendancetracker.invitation;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.registrar.ATRole;
import nl.itvitae.attendancetracker.registrar.RegistrarDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin("${at.cors}")
@RequestMapping("invitations")
public class InvitationController {
    private final InvitationRepository invitationRepository;

    private final InvitationService invitationService;

    @PostMapping("for-teacher")
    public InvitationDto getTeacherOneTimePassword(@RequestBody RegistrarDto personnelDto) {
        var name = personnelDto.name().trim();
        invitationService.checkInvitationIsValidAndCleanExpiredInvitations(name);
        return InvitationDto.from(invitationRepository.save(new Invitation(name, ATRole.TEACHER)));
    }

    @PostMapping("for-coach-or-admin")
    public InvitationDto getCoachOrAdminOneTimePassword(@RequestBody RegistrarDto personnelDto) {
        var name = personnelDto.name().trim();
        invitationService.checkInvitationIsValidAndCleanExpiredInvitations(name);
        return InvitationDto.from(invitationRepository.save(new Invitation(name, ATRole.ADMIN)));
    }

    @GetMapping("{id}")
    public ResponseEntity<InvitationDto> getInvitation(@PathVariable UUID id) {
        return invitationRepository.findById(id).map(InvitationDto::from).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
