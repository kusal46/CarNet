package com.carenet.backend.auth;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

/**
 * JWT creation & parsing using JJWT 0.11.x.
 */
@Service
public class JwtService {

    private final JwtProperties props;
    private final SecretKey key;

    public JwtService(JwtProperties props) {
        this.props = props;

        byte[] keyBytes;
        // Try Base64 first (recommended); if not base64, use raw bytes.
        try {
            keyBytes = Decoders.BASE64.decode(props.getSecret());
        } catch (IllegalArgumentException ex) {
            keyBytes = props.getSecret().getBytes(StandardCharsets.UTF_8);
        }
        if (keyBytes.length < 32) { // 256 bits
            throw new IllegalStateException(
                "JWT secret too short; need >= 256 bits after decoding.");
        }
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Create a signed JWT.
     *
     * @param userId user id (stored as "uid")
     * @param email  subject
     * @param role   role claim
     * @return compact JWT
     */
    public String generateToken(Long userId, String email, String role) {
        Instant now = Instant.now();
        Instant exp = now.plus(props.getTtl());

        return Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
                .setIssuer(props.getIssuer())
                .setSubject(email)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .claim("uid", userId)
                .claim("role", role)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Parse token (accepts optional "Bearer " prefix) and return Claims.
     */
    public Claims parse(String token) {
        String raw = stripBearer(token);
        Jws<Claims> jws = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(raw);
        return jws.getBody();
    }

    /**
     * Extract user id from claims.
     */
    public Long getUserId(Claims claims) {
        if (claims == null) return null;
        Object v = claims.get("uid");
        if (v == null) return null;
        if (v instanceof Number) return ((Number) v).longValue();
        try { return Long.parseLong(String.valueOf(v)); } catch (Exception ignore) { return null; }
    }

    /**
     * Convenience: parse token and read user id.
     */
    public Long getUserId(String token) {
        return getUserId(parse(token));
    }

    /**
     * Convenience: parse token and read role.
     */
    public String getRole(String token) {
        Claims c = parse(token);
        Object v = c.get("role");
        return v == null ? null : v.toString();
    }

    public String getEmail(String token) {
        return parse(token).getSubject();
    }

    // -------- helpers --------

    private static String stripBearer(String token) {
        if (token == null) return "";
        String t = token.trim();
        return t.regionMatches(true, 0, "Bearer ", 0, 7) ? t.substring(7) : t;
    }
}
