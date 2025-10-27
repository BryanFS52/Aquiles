package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "improvement_plan_activities")
public class ImprovementPlanActivity implements Serializable {
    @Transient
    private final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "delivery_date", nullable = false)
    private LocalDate deliveryDate;

    // 1. Relation (M-1) with ImprovementPlan
    @ManyToOne
    @JoinColumn(name = "improvement_plan_id", nullable = false)
    private ImprovementPlan improvementPlan;

    // 2. Relation (M-M) with ImprovementPlanEvidenceType (propietario)
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "improvement_plan_activity_evidence_map",
            joinColumns = @JoinColumn(name = "improvement_plan_activity_id"),
            inverseJoinColumns = @JoinColumn(name = "evidence_type_id")
    )
    private List<ImprovementPlanEvidenceType> evidenceTypes = new ArrayList<>();

    // 3. Relation (M-1) with ImprovementPlanDelivery
    @ManyToOne
    @JoinColumn(name = "delivery_id", nullable = false)
    private ImprovementPlanDelivery improvementPlanDelivery;
}