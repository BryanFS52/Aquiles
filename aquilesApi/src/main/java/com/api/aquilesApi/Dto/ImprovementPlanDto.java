package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImprovementPlanDto {
    private Long id;

    private String actNumber;

    // @NotBlank(message = "La ciudad es obligatoria")
    // @Size(max = 55, message = "La ciudad no puede exceder los 55 caracteres")
    private String city;

    // @NotNull(message = "La fecha es obligatoria")
    private String date;

    private String startTime;

    private String endTime;

    private String place;

    // @NotBlank(message = "El motivo es obligatorio")
    // @Size(max = 255, message = "El motivo no puede exceder los 255 caracteres")
    private String reason;

    private String objectives;

    // @NotNull(message = "El estado es obligatorio")
    private Boolean state;

    // @NotNull(message = "La calificación es obligatoria")
    private Boolean qualification;

    private String conclusions;
    // @NotNull(message = "El estudiante es obligatorio")
    private Long studentId;

    // @NotNull(message = "La competencia del instructor es obligatoria")
    private Long teacherCompetence;

    private Long learningOutcome;

    // Relations
    private List<ImprovementPlanActivityDto> improvementPlanActivity;
    private ImprovementPlanFaultTypeDto faultType;
    private ImprovementPlanEvidenceMapDto improvementPlanEvidenceMapDto;
    private ImprovementPlanEvaluationDto improvementPlanEvaluation;
}
