package lk.sliit.carnet.auth.dto;
public record AuthResponse(String accessToken, String tokenType, Long userId, String role) {
    public AuthResponse(String token, Long userId, String role) { this(token, "Bearer", userId, role); }
}
