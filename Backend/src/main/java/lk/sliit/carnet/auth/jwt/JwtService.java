package lk.sliit.carnet.auth.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

import javax.crypto.SecretKey;

@Service
public class JwtService {
    private final Key key = Keys.hmacShaKeyFor(
        System.getenv().getOrDefault("JWT_SECRET",
        "change-me-please-change-me-please-32bytes!").getBytes());

    public String generate(Map<String,Object> claims, String subject, long minutes) {
        Instant now = Instant.now();
        return Jwts.builder()
        .subject(subject).claims(claims)
        .issuedAt(Date.from(now))
        .expiration(Date.from(now.plus(minutes, ChronoUnit.MINUTES)))
        .signWith(key).compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parser().verifyWith((SecretKey) key).build().parseSignedClaims(token);
    }
}
