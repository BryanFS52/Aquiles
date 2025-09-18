package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistDto {
    private Long id;

    private Boolean state;

    private String dateAssigned;

    // @NotNull(message = "El trimestre es obligatorio")
    private String trimester;

    private String component;

    private Long trainingProjectId;
    
    private String trainingProjectName;

    // Relations - Relación 1:1 con Evaluación
    // @NotNull(message = "Los jurados asociados son obligatorios") // ← Removido: no siempre son obligatorios
    private Set<Long> associatedJuries;
    
    // Para la relación 1:1 con evaluación - solo uno de estos campos se usa según el contexto
    private EvaluationsDto evaluation; // Objeto completo para respuestas
    
    private TeamsScrumDto teamsScrum;
    private String studySheets;
    private List<ItemDto> items;

    private EvaluationDto evaluation;

    private List<TeamsScrumDto> teamsScrum;

    private List<ChecklistQualificationDto> checklistQualifications;
}
