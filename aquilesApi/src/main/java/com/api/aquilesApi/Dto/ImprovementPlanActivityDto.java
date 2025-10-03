package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImprovementPlanActivityDto {
    private Long id;

    // @NotBlank(message = "The description is required")
    // @Size(max = 500, message = "The description cannot exceed 500 characters")
    private String description;

    // @NotNull(message = "The delivery date is required")
    private String deliveryDate;

    // Relations
    // @NotBlank(message = "The learning outcome is required")
    // @Size(max = 500, message = "The learning outcome cannot exceed 500 characters")
    private Long learningOutcomeId;

    // @NotNull(message = "The Improvement Plan ID is required")
    private ImprovementPlanDto improvementPlan;

    // @NotBlank(message = "The delivery format is required")
    // @Size(max = 100, message = "The delivery format cannot exceed 100 characters")
    private ImprovementPlanDeliveryDto improvementPlanDelivery;
}
