package com.carenet.backend.auth;

import com.carenet.backend.auth.dto.AuthResponse;
import com.carenet.backend.auth.dto.LoginRequest;
import com.carenet.backend.auth.dto.RegisterRequest;
import com.carenet.backend.user.User;
import com.carenet.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository users,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest req) {
        if (users.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User u = new User();
        u.setEmail(req.getEmail());
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        u.setFirstName(req.getFirstName());
        u.setLastName(req.getLastName());
        u.setCity(req.getCity());
        u.setAddress(req.getAddress());

        // your DB has NOT NULL on users.name
        String fullName = ((req.getFirstName() == null ? "" : req.getFirstName().trim()) + " "
                + (req.getLastName() == null ? "" : req.getLastName().trim())).trim();
        u.setName(fullName.isEmpty() ? req.getEmail() : fullName);

        // roles are stored as a plain string in DB
        u.setRole(normalizeRole(req.getRole()));

        users.save(u);

        String token = jwtService.generateToken(u.getId(), u.getEmail(), u.getRole());
        return new AuthResponse(token, u.getRole(), u.getId(), u.getEmail());
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {
        User u = users.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), u.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = jwtService.generateToken(u.getId(), u.getEmail(), u.getRole());
        return new AuthResponse(token, u.getRole(), u.getId(), u.getEmail());
    }

    private String normalizeRole(String input) {
        if (input == null) return "care-seeker";
        String r = input.trim().toLowerCase();
        return switch (r) {
            case "admin" -> "admin";
            case "caregiver" -> "caregiver";
            case "care-seeker", "careseeker", "seeker" -> "care-seeker";
            default -> "care-seeker";
        };
    }
}
