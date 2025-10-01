package com.carenet.backend.auth.dto;

import com.carenet.backend.user.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Signup payload used by /auth/register
 * {
 *   "firstName": "...",
 *   "lastName":  "...",
 *   "email":     "...",
 *   "password":  "...",
 *   "city":      "...",
 *   "address":   "...",
 *   "role":      "CARE_SEEKER" | "CAREGIVER" | "ADMIN"
 * }
 */
public class RegisterRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 8)
    private String password;

    @NotBlank
    private String city;

    @NotBlank
    private String address;

    @NotNull
    private Role role; // com.carenet.backend.user.Role enum

    // ---- getters & setters ----
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
