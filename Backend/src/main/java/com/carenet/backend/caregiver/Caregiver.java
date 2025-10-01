// src/main/java/com/carenet/backend/caregiver/Caregiver.java
package com.carenet.backend.caregiver;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@Entity
@Table(name = "caregivers")
public class Caregiver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 200)
    private String email;

    @Column(nullable = false, length = 200)
    private String location;

    @Column(nullable = false, length = 2000)
    private String summary;

    @Column(nullable = false)
    private boolean available;

    // Matches DECIMAL(10,2) in your V4 migration
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal rate;

    // Stored as JSON text in MySQL (Option B)
    @Column(nullable = false, columnDefinition = "json")
    private String languages;  // e.g. ["English","Hindi"]

    @Column(nullable = false, columnDefinition = "json")
    private String skills;     // e.g. ["CPR","First Aid"]

    @Column(nullable = false, columnDefinition = "json")
    private String services;   // e.g. ["Elder care","Child care"]

    @Column(name = "avatar_path", length = 512)
    private String avatarPath;

    @OneToMany(mappedBy = "caregiver", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Certification> certifications = new ArrayList<>();

    @OneToMany(mappedBy = "caregiver", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorkHistory> workHistory = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    // Convenience helpers to keep both sides of the relation in sync
    public void addCertification(Certification c) {
        certifications.add(c);
        c.setCaregiver(this);
    }

    public void removeCertification(Certification c) {
        certifications.remove(c);
        c.setCaregiver(null);
    }

    public void addWork(WorkHistory w) {
        workHistory.add(w);
        w.setCaregiver(this);
    }

    public void removeWork(WorkHistory w) {
        workHistory.remove(w);
        w.setCaregiver(null);
    }
}
