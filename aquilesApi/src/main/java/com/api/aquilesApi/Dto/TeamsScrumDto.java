package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamsScrumDto {

    private Long id;
    @NotNull(message = "El nombre es obligatorio")
    private String name;

    // @NotNull(message = "El problema es obligatorio")
    private String problem;

    // @NotNull(message = "Los objetivos son obligatorios")
    private String objectives;

    // @NotNull(message = "El nombre es obligatorio")
    private String description;

    // @NotNull(message = "La justifacion es obligatoria")
    private String justification;

    // Relations
    private ChecklistDto checklist;
}   