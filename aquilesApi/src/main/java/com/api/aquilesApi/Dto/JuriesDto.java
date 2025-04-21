package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JuriesDto implements Serializable {
    private Long id;

    @NotNull(message = "La fecha asignada es obligatoria")
    private Date dateAssigned;

    // Relación con TrainersEntity (DTO)
    @NotNull(message = "El entrenador es obligatorio")
    private TrainersDto trainer;

    // Relación con ChecklistEntity (DTO)
    private List<ChecklistDto> listChecklistSubstantiationLists;

    // Relación con DiarySustainationsEntity (DTO)
    private List<DiarySustainationsDto> listDiarySustainations;
}
