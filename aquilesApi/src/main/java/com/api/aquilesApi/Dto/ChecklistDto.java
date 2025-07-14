package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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



    // Relations
    @NotNull(message = "Los jurados asociados son obligatorios")
    private Set<Long> associatedJuries;

    private ItemDto item;

    private Long evaluations;

    private TeamsScrumDto teamsScrum;

    private Long studySheets;

                                
}


    