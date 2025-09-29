package lk.sliit.carnet.auth;

import lk.sliit.carnet.auth.dto.*;
import lk.sliit.carnet.auth.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    // Removed duplicate register method

    public AuthResponse login(LoginRequest r) {
        var user = users.findByEmail(r.email()).orElseThrow(() -> new IllegalArgumentException("Bad credentials"));
        if (!user.isActive() || !encoder.matches(r.password(), user.getPasswordHash()))
        throw new IllegalArgumentException("Bad credentials");
        String token = jwt.generate(java.util.Map.of("role", user.getRole().name()), user.getEmail(), 60);
        return new AuthResponse(token, user.getId(), user.getRole().name());
    }

    public AuthResponse register(RegisterRequest r) {
        if (users.existsByEmail(r.email())) throw new IllegalArgumentException("Email already used");
        Role role = Role.valueOf(r.role()); // CARE_SEEKER / CAREGIVER / ADMIN

        var user = users.save(AppUser.builder()
            .email(r.email())
            .passwordHash(encoder.encode(r.password()))
            .role(role)
            .active(true)
            .firstName(r.firstName())
            .lastName(r.lastName())
            .city(r.city())
            .address(r.address())
            .build());

        String token = jwt.generate(java.util.Map.of("role", role.name()), user.getEmail(), 60);
        return new AuthResponse(token, user.getId(), role.name());
        }

}
