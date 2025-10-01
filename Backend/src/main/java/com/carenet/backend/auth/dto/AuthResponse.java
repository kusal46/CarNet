package com.carenet.backend.auth.dto;

import com.carenet.backend.user.Role;

public record AuthResponse(
        String accessToken,
        String tokenType,
        Long userId,
        Role role
) {}
