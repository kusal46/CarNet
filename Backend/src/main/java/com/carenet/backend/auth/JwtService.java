package com.carenet.backend.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {
    private final SecretKey key;
    private final long expMinutes;

    public JwtService(
        @Value("${app.jwt.secret}") String secret,
        @Value("${app.jwt.exp-min:120}") long expMinutes) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expMinutes = expMinutes;
    }

    public String generate(Long userId, String email, String role) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(expMinutes * 60);
        return Jwts.builder()
            .setSubject(String.valueOf(userId))
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(exp))
            .addClaims(Map.of("email", email, "role", role))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
    }
}
