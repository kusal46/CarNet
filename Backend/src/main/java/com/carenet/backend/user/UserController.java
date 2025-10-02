// src/main/java/com/carenet/backend/user/UserController.java
package com.carenet.backend.user;

import com.carenet.backend.auth.JwtService;
import io.jsonwebtoken.Claims;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    private final UserRepository users;
    private final JwtService jwt;

    public UserController(UserRepository users, JwtService jwt) {
        this.users = users;
        this.jwt = jwt;
    }

    /**
     * Returns the authenticated user's profile.
     * Expected header (frontend): Authorization: Bearer <JWT>
     * For quick testing you can also pass ?token=<JWT>
     */
    @GetMapping("/me")
    public MeResponse me(
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String auth,
            @RequestParam(name = "token", required = false) String tokenParam
    ) {
        // --- get the token ---
        final String token = extractBearer(auth, tokenParam);

        // --- parse & validate ---
        final Claims claims;
        try {
            claims = jwt.parse(token);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }

        // --- identify user from token claims ---
        Long uid = jwt.getUserId(claims); // reads "uid" or "userId"
        String email = claims.get("email", String.class);
        if (email == null) email = claims.getSubject();

        // --- load user from DB ---
        User u = null;
        if (uid != null) {
            u = users.findById(uid).orElse(null);
        }
        if (u == null && email != null) {
            u = users.findByEmail(email).orElse(null);
        }
        if (u == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        return MeResponse.from(u);
    }

    // ---------- helpers ----------

    private String extractBearer(String authHeader, String tokenParam) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7).trim();
        }
        if (tokenParam != null && !tokenParam.isBlank()) {
            return tokenParam.trim();
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing Bearer token");
    }

    // Simple DTO the frontend expects
    public record MeResponse(
            Long id,
            String email,
            String firstName,
            String lastName,
            String city,
            String address,
            String role
    ) {
        public static MeResponse from(User u) {
            return new MeResponse(
                    u.getId(),
                    u.getEmail(),
                    u.getFirstName(),
                    u.getLastName(),
                    u.getCity(),
                    u.getAddress(),
                    u.getRole()
            );
        }
    }
}
