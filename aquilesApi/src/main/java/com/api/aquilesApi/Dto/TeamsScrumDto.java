package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamsScrumDto {

    private Long id;
    // @NotNull(message = "El nombre es obligatorio")
    private String teamName;

    // @NotNull(message = "El nombre del proyecto es obligatorio")
    private String projectName;

    // @NotNull(message = "El problema es obligatorio")
    private String problem;

    // @NotNull(message = "Los objetivos son obligatorios")
    private String objectives;

    // @NotNull(message = "El nombre es obligatorio")
    private String description;

    // @NotNull(message = "La justifacion es obligatoria")
    private String projectJustification;

    // Relations
    private ChecklistDto checklist;
    private Long studySheetId;
    private List<Long> memberIds;
}   