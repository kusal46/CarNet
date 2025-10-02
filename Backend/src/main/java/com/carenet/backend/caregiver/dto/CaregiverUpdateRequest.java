package com.carenet.backend.caregiver.dto;

import java.util.List;

/**
 * All fields optional so we can use it for PATCH (partial) and PUT (full replace).
 * For PUT, your controller can enforce requireds if you want.
 */
public class CaregiverUpdateRequest {
    private String name;
    private String email;
    private String location;
    private String summary;
    private Boolean available;
    private String rate; // keep as string to avoid JS floating issues; controller converts to BigDecimal
    private List<String> languages;
    private List<String> skills;
    private List<String> services;
    private List<CertDto> certifications;
    private List<WorkDto> workHistory;

    public static class CertDto {
        private String name;
        private String issuer;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getIssuer() { return issuer; }
        public void setIssuer(String issuer) { this.issuer = issuer; }
    }

    public static class WorkDto {
        private String description;
        private String startDate; // yyyy-MM-dd
        private String endDate;   // yyyy-MM-dd

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getStartDate() { return startDate; }
        public void setStartDate(String startDate) { this.startDate = startDate; }
        public String getEndDate() { return endDate; }
        public void setEndDate(String endDate) { this.endDate = endDate; }
    }

    // getters/setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }
    public String getRate() { return rate; }
    public void setRate(String rate) { this.rate = rate; }
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
}
