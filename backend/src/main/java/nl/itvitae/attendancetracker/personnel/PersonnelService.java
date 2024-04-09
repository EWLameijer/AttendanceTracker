package nl.itvitae.attendancetracker.personnel;

import lombok.RequiredArgsConstructor;
import nl.itvitae.attendancetracker.authority.Authority;
import nl.itvitae.attendancetracker.authority.AuthorityRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PersonnelService {
    private final PasswordEncoder passwordEncoder;

    private final PersonnelRepository personnelRepository;

    private final AuthorityRepository authorityRepository;

    public Teacher

    private Personnel save(String username, String password, ATRole role) {
        var personnel = new Personnel(username, passwordEncoder.encode(password), role);
        personnelRepository.save(personnel);
        var authority = new Authority(username, role.asSpringSecurityRole());
        authorityRepository.save(authority);
        return personnel;
    }
}
