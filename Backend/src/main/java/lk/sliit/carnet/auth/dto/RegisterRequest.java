package lk.sliit.carnet.auth.dto;
import jakarta.validation.constraints.*;

public record RegisterRequest(
  @NotBlank @Size(max=80)  String firstName,
  @NotBlank @Size(max=80)  String lastName,
  @Email @NotBlank         String email,
  @NotBlank @Size(min=8)   String password,
  @NotBlank @Size(max=120) String city,
  @NotBlank @Size(max=200) String address,
  @NotNull                 String role   // "CARE_SEEKER" | "CAREGIVER" | "ADMIN"
) {}
