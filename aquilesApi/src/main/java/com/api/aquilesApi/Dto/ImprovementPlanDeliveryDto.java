package com.api.aquilesApi.Dto;

import com.api.aquilesApi.Entity.ImprovementPlanActivity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImprovementPlanDeliveryDto {
    private Long id;

    private String deliveryFormat;

    // Relation
    private List<ImprovementPlanActivity> improvementPlanActivities;
}