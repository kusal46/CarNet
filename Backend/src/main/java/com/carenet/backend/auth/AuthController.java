package com.carenet.backend.auth;

import com.carenet.backend.auth.dto.AuthResponse;
import com.carenet.backend.auth.dto.LoginRequest;
import com.carenet.backend.auth.dto.RegisterRequest;
import com.carenet.backend.user.User;
import com.carenet.backend.user.UserRepository;
import jakarta.validation.Valid;                                    // <-- Valid
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;        // <-- ResponseStatusException

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UserRepository repo, PasswordEncoder encoder, JwtService jwt) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@RequestBody @Valid RegisterRequest req) {
        // 409 if duplicate
        repo.findByEmail(req.getEmail()).ifPresent(u -> {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        });

        User u = new User();
        u.setName(req.getFirstName() + " " + req.getLastName());
        u.setEmail(req.getEmail());
        u.setPasswordHash(encoder.encode(req.getPassword()));
        u.setCity(req.getCity());
        u.setAddress(req.getAddress());
        u.setRole(req.getRole());
        u = repo.save(u);

        String token = jwt.generate(u.getId(), u.getEmail(), u.getRole().name());
        return new AuthResponse(token, "Bearer", u.getId(), u.getRole());
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody @Valid LoginRequest req) {
        User u = repo.findByEmail(req.getEmail())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials")); // <-- a Supplier

        if (!encoder.matches(req.getPassword(), u.getPasswordHash())) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = jwt.generate(u.getId(), u.getEmail(), u.getRole().name());
        return new AuthResponse(token, "Bearer", u.getId(), u.getRole());
    }
}
