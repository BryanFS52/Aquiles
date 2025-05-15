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
    @NotNull(message = "El nombre es obligatorio")
    private String description;
    @NotNull(message = "Los miembros son obligatorio")
    private String members;

    // Relations
    private Long checklistId;
    private Long teamScrumId;
}