package com.api.aquilesApi.Dto;

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

    // @NotNull(message = "El estado es obligatorio")
    private Boolean state;

    // @NotNull(message = "Las observaciones son obligatorias")
    // @Size(max = 255, message = "Las observaciones no pueden exceder los 255 caracteres")
    private String remarks;

    // @NotNull(message = "La firma del instructor es obligatoria") // ← Removido: la firma puede ser opcional inicialmente
    // @Size(max = 255, message = "La firma del instructor no puede exceder los 255 caracteres")
    private String instructorSignature;

    // @NotNull(message = "El criterio de evaluación es obligatorio") // ← Removido: puede ser opcional inicialmente
    private boolean evaluationCriteria;

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

    private List<TeamsScrumDto> teamsScrum;
    private String studySheets;
    private List<ItemDto> items;
    private List<Long> deletedItemIds; // ← Lista de IDs de items a eliminar
}