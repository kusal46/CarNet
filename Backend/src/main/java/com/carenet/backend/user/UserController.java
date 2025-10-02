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

    @GetMapping("/me")
    public MeResponse me(@RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String auth) {
        User u = currentUser(auth);
        return MeResponse.from(u);
    }

    @PutMapping("/me")
    public MeResponse updateMe(
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String auth,
            @RequestBody UpdateMeRequest req
    ) {
        User u = currentUser(auth);

        // Only update allowed fields
        if (req.getFirstName() != null) u.setFirstName(req.getFirstName().trim());
        if (req.getLastName()  != null) u.setLastName(req.getLastName().trim());
        if (req.getCity()      != null) u.setCity(req.getCity().trim());
        if (req.getAddress()   != null) u.setAddress(req.getAddress().trim());

        users.save(u);
        return MeResponse.from(u);
    }

    private User currentUser(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing Bearer token");
        }
        final String token = authHeader.substring(7).trim();

        final Claims claims;
        try {
            claims = jwt.parse(token);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }

        Long uid = jwt.getUserId(claims);
        String email = claims.get("email", String.class);
        if (email == null) email = claims.getSubject();

        User u = null;
        if (uid != null) u = users.findById(uid).orElse(null);
        if (u == null && email != null) u = users.findByEmail(email).orElse(null);
        if (u == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        return u;
    }

    public record MeResponse(Long id, String email, String firstName, String lastName,
                            String city, String address, String role) {
        public static MeResponse from(User u) {
            return new MeResponse(
                u.getId(), u.getEmail(), u.getFirstName(), u.getLastName(),
                u.getCity(), u.getAddress(), u.getRole()
            );
        }
    }
}
