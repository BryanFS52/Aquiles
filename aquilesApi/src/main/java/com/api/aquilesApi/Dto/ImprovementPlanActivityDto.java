package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImprovementPlanActivityDto {
    private Long id;
    private String description;
    private String objectives;
    private String conclusions;
    private String deliveryDate;
    private ImprovementPlanDto improvementPlan;
    private List<ImprovementPlanEvidenceTypeDto> evidenceTypes;
    private ImprovementPlanDeliveryDto improvementPlanDelivery;
}
