/*

package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImprovementPlanSupportingContentDto {
    private Long id;

    @NotNull(message = "The Improvement Plan ID is required")
    private Long improvementPlanId;

    @NotBlank(message = "The type is required")
    private String type;

    @NotBlank(message = "The URL is required")
    private String url;

    @NotBlank(message = "The name is required")
    private String name;

    @NotNull(message = "The concertation date is required")
    private String concertationDate;

    @NotNull(message = "The final delivery date is required")
    private String finalDeliveryDate;
}


 */