package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {
    // Propiedades para almacenar los datos de la entidad Project
    private Long projectId; // ID del proyecto
    private String description; // Descripción del proyecto
    private String problem; // Problema del proyecto
    private String objectives; // Objetivos del proyecto
    private String justification; // Justificación del proyecto
    private Long fk_team_scrum_id; // ID del equipo Scrum asociado
}
