// src/main/java/com/carenet/backend/user/UserProfileDto.java
package com.carenet.backend.user;

public record UserProfileDto(
    Long id,
    String email,
    String firstName,
    String lastName,
    String city,
    String address,
    String role
) {
    public static UserProfileDto from(User u) {
        return new UserProfileDto(
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
