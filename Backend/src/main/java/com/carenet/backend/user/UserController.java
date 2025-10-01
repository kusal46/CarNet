package com.carenet.backend.user;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.carenet.backend.auth.dto.RegisterRequest;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserController(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @GetMapping
    public List<User> all() {
        return repo.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User register(@Valid @RequestBody RegisterRequest req) {
        // optional: prevent duplicate email
        repo.findByEmail(req.getEmail()).ifPresent(u -> {
            throw new IllegalArgumentException("Email already registered");
        });

        @SuppressWarnings("unused")
        String hash = encoder.encode(req.getPassword());
        User user = new User();
        return repo.save(user);
    }
}
