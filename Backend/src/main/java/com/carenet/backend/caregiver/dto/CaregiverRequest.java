package com.carenet.backend.caregiver.dto;

import java.util.List;

/**
 * Payload that the frontend sends in the "data" part of the multipart request.
 * Dates are strings (YYYY-MM-DD). Change to LocalDate if you prefer.
 */
public class CaregiverRequest {
    private String name;
    private String email;
    private String location;
    private String summary;

    private boolean available;
    private double rate;

    private List<String> languages;
    private List<String> skills;
    private List<String> services;

    private List<CertDto> certifications;
    private List<WorkDto> workHistory;

    // --- getters & setters ---
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public double getRate() { return rate; }
    public void setRate(double rate) { this.rate = rate; }

    public List<String> getLanguages() { return languages; }
    public void setLanguages(List<String> languages) { this.languages = languages; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public List<String> getServices() { return services; }
    public void setServices(List<String> services) { this.services = services; }

    public List<CertDto> getCertifications() { return certifications; }
    public void setCertifications(List<CertDto> certifications) { this.certifications = certifications; }

    public List<WorkDto> getWorkHistory() { return workHistory; }
    public void setWorkHistory(List<WorkDto> workHistory) { this.workHistory = workHistory; }

    // ---------- nested DTOs ----------
    public static class CertDto {
        private String name;
        private String issuer;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getIssuer() { return issuer; }
        public void setIssuer(String issuer) { this.issuer = issuer; }
    }

    public static class WorkDto {
        private String company;
        private String role;
        // ISO strings e.g. "2025-10-01". If you prefer LocalDate, change types + controller.
        private String startDate;
        private String endDate;
        private String description;

        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getStartDate() { return startDate; }
        public void setStartDate(String startDate) { this.startDate = startDate; }

        public String getEndDate() { return endDate; }
        public void setEndDate(String endDate) { this.endDate = endDate; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
}
