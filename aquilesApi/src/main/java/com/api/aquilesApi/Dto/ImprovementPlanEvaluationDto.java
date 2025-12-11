package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImprovementPlanEvaluationDto {
    private Long id;

    // @NotNull(message = "Pertinence is required")
    private Boolean pertinence;

    // @NotNull(message = "Validity is required")
    private Boolean validity;

    // @NotNull(message = "Authenticity is required")
    private Boolean authenticity;

    // @NotNull(message = "Quality is required")
    private Boolean quality;

    // @NotNull(message = "Judgment is required")
    private Boolean judgment;

    // Relations - Usar DTO light para evitar referencia circular
    // @NotNull(message = "Improvement Plan ID is required")
    private ImprovementPlanLightDto improvementPlan;
}
