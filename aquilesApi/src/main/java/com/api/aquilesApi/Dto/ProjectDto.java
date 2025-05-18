package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {
    private Long projectId;

    @NotNull(message = "El nombre es obligatorio")
    private String description;

    @NotNull(message = "El nombre es obligatorio")
    private String name;

    @NotNull(message = "El nombre es obligatorio")
    private String problem;

    @NotNull(message = "El nombre es obligatorio")
    private String objectives;

    @NotNull(message = "El nombre es obligatorio")
    private String justification;

    @NotNull(message = "Los miembros son obligatorios")
    private List<String> members;

    // Relations
    private Long fk_team_scrum_id;
}