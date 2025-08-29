package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "ImprovementPlan_activities")
public class ImprovementPlanActivity implements Serializable {

    @Transient
    private final SimpleDateFormat dateTimeFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "delivery_date", nullable = false)
    private LocalDateTime deliveryDate;

    @Column(name = "learning_outcome", nullable = false)
    private Long learningOutcomeId;

    // (M-1) Relation with ImprovementPlan
    @ManyToOne
    @JoinColumn(name = "improvement_plan_id", nullable = false)
    private ImprovementPlan improvementPlan;

    // (M-1) Relation with ImprovementPlanDelivery
    @ManyToOne
    @JoinColumn(name = "delivery_id", nullable = false)
    private ImprovementPlanDelivery delivery;

}