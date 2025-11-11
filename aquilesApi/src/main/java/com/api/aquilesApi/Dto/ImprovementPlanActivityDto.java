package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
    private String deliveryDate;
    private ImprovementPlanDto improvementPlan;
    private List<ImprovementPlanEvidenceTypeDto> evidenceTypes;
    private ImprovementPlanDeliveryDto improvementPlanDelivery;
}
