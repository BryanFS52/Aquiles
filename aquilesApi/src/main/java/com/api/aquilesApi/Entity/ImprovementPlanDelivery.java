package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "improvement_plan_deliveries")
public class ImprovementPlanDelivery implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "delivery_format", nullable = false, unique = true)
    private String deliveryFormat;

    // Relations
    // 1. (1-M) with ImprovementPlanActivity
    @OneToMany(mappedBy = "improvementPlanDelivery")
    private List<ImprovementPlanActivity> activities;

}