package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "ImprovementPlan_evidence_types")
public class ImprovementPlanEvidenceType implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    // Relations
    // 1. Relation (M-M) with improvementPlan
    @ManyToMany(mappedBy = "evidenceTypes")
    private List<ImprovementPlan> improvementPlans = new ArrayList<>();

}