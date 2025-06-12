package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JustificationTypeDto {
    private Long id;
    @NotNull(message = "El nombre es obligatorio")
    private String name;
    @NotNull(message = "La descripción es obligatoria")
    private String description;

}