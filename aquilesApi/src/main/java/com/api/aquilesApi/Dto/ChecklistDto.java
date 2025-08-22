package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistDto {
    private Long id;

    @NotNull(message = "El estado es obligatorio")
    private Boolean state;

    @NotNull(message = "Las observaciones son obligatorias")
    @Size(max = 255, message = "Las observaciones no pueden exceder los 255 caracteres")
    private String remarks;

    @NotNull(message = "La firma del instructor es obligatoria")
    @Size(max = 255, message = "La firma del instructor no puede exceder los 255 caracteres")
    private String instructorSignature;

    @NotNull(message = "El criterio de evaluación es obligatorio")
    private boolean evaluationCriteria;

    @NotNull(message = "El trimestre es obligatorio")
    private String trimester;

    private String component;

    // Relations
    @NotNull(message = "Los jurados asociados son obligatorios")
    private Set<Long> associatedJuries;
    private EvaluationsDto evaluation;
    private Long evaluationId; // ID de la evaluación para vinculación
    private TeamsScrumDto teamsScrum;
    private Long studySheets;
    private List<ItemDto> items;
}
