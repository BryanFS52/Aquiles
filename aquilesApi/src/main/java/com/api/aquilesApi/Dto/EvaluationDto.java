package com.api.aquilesApi.Dto;

import com.api.aquilesApi.Entity.TeamsScrum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EvaluationDto {
    private Long id;

    // @Size(max = 500, message = "Las observaciones no pueden exceder los 500 caracteres")
    private String observations;

    // @Size(max = 255, message = "Las recomendaciones no pueden exceder los 255 caracteres")
    private String recommendations;

    // @NotBlank(message = "El juicio de valor es obligatorio")
    // @Size(max = 60, message = "El juicio de valor no puede exceder los 60 caracteres")
    private String valueJudgment;

    private String instructorSignature;
    private ChecklistDto checklist;
    private TeamsScrum teamsScrum;

}