package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationsDto {
    private Long id;

    // Observaciones pueden estar vacías inicialmente pero no nulas
    @Size(max = 500, message = "Las observaciones no pueden exceder los 500 caracteres")
    private String observations;

    // Recomendaciones pueden estar vacías inicialmente pero no nulas
    @Size(max = 255, message = "Las recomendaciones no pueden exceder los 255 caracteres")
    private String recommendations;

    @NotBlank(message = "El juicio de valor es obligatorio")
    @Size(max = 60, message = "El juicio de valor no puede exceder los 60 caracteres")
    private String valueJudgment;

    // Foreign key obligatoria para establecer la relación 1:1
    @NotNull(message = "El ID del checklist es obligatorio para establecer la relación")
    private Long checklistId;

    // Identificador del team scrum asociado a esta evaluación
    private Long teamScrumId;
}