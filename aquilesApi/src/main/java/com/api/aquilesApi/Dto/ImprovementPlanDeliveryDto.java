package com.api.aquilesApi.Dto;

import com.api.aquilesApi.Entity.ImprovementPlanActivity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImprovementPlanDeliveryDto {
    private Long id;

    //@NotBlank(message = "El formato de entrega es obligatorio")
    private String deliveryFormat;

    // Relation
    private List<ImprovementPlanActivity>  improvementPlanActivities;
}