package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChecklistDto {
    private Long id;

    // @NotNull(message = "El estado es obligatorio")
    private Boolean state;

    // ← OPCIONAL al crear (coordinador), se llena cuando el instructor califica
    private String remarks;

    // ← NULL al crear, se llena cuando el instructor firma
    private String instructorSignature;

    // ← NULL al crear, se llena cuando el instructor evalúa
    private Boolean evaluationCriteria;

    private String dateAssigned;

    // @NotNull(message = "El trimestre es obligatorio")
    private String trimester;

    private String component;

    private Long trainingProjectId;

    // Relations - Relación 1:1 con Evaluación
    // @NotNull(message = "Los jurados asociados son obligatorios") // ← Removido: no siempre son obligatorios
    private Set<Long> associatedJuries;

    // Para la relación 1:1 con evaluación - solo uno de estos campos se usa según el contexto
    private EvaluationDto evaluation; // Objeto completo para respuestas

    private List<TeamsScrumDto> teamsScrum;
    private String studySheets;
    private List<ItemDto> items;
    private List<Long> deletedItemIds; // ← Lista de IDs de items a eliminar
}