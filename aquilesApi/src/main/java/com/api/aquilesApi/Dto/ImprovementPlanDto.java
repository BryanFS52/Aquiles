package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImprovementPlanDto {
    private Long id;

    // @NotBlank(message = "La ciudad es obligatoria")
    // @Size(max = 55, message = "La ciudad no puede exceder los 55 caracteres")
    private String city;

    // @NotNull(message = "La fecha es obligatoria")
    private String date;

    // @NotBlank(message = "El motivo es obligatorio")
    // @Size(max = 255, message = "El motivo no puede exceder los 255 caracteres")
    private String reason;

    // @NotNull(message = "El estado es obligatorio")
    private Boolean state;

    // @NotNull(message = "La calificación es obligatoria")
    private Boolean qualification;

    // @NotNull(message = "El estudiante es obligatorio")
    private Long studentId;

    // @NotNull(message = "La competencia del instructor es obligatoria")
    private Long teacherCompetence;


    // Relations
    private List<ImprovementPlanActivityDto> improvementPlanActivity;
    private ImprovementPlanFaultTypeDto faultType;
    private ImprovementPlanEvidenceMapDto improvementPlanEvidenceMapDto;
}
