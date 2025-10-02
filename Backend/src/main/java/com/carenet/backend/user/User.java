package com.carenet.backend.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter @Setter
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    // THIS MUST EXIST AND BE NON-NULL
    @Column(name = "name", nullable = false)
    private String name;

    private String city;
    private String address;

    // stored as lowercase string: "caregiver" | "care-seeker" | "admin"
    @Column(nullable = false)
    private String role;

    @PrePersist @PreUpdate
    private void ensureNameAndRole() {
        if (name == null || name.isBlank()) {
            String first = firstName != null ? firstName.trim() : "";
            String last  = lastName  != null ? lastName.trim()  : "";
            String candidate = (first + " " + last).trim();
            if (candidate.isBlank()) {
                candidate = email != null ? email.split("@")[0] : "user";
            }
            name = candidate;
        }
        if (role != null) {
            role = role.trim().toLowerCase();
        }
    }
}
