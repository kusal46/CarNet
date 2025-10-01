// src/main/java/com/carenet/backend/caregiver/WorkHistory.java
package com.carenet.backend.caregiver;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@ToString(exclude = "caregiver")
@Entity
@Table(name = "caregiver_work_history") // <<< IMPORTANT
public class WorkHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Option B: only what exists in the DB
    @Column(name = "descr", length = 2000, nullable = false)
    private String descr;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    private Caregiver caregiver;
}
