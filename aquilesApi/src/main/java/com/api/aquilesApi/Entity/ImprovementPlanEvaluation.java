package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "improvement_plan_evaluation")
public class ImprovementPlanEvaluation implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pertinence", nullable = false)
    private Boolean pertinence;

    @Column(name = "validity", nullable = false)
    private Boolean validity;

    @Column(name = "authenticity", nullable = false)
    private Boolean authenticity;

    @Column(name = "quality", nullable = false)
    private Boolean quality;

    @Column(name = "judgment", nullable = false)
    private Boolean judgment;

    // Relación 1:1 con ImprovementPlan (propietario de la relación)
    @OneToOne
    @JoinColumn(name = "improvement_plan_id", nullable = false, unique = true)
    private ImprovementPlan improvementPlan;

}
