package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationsTypeDto {

    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 55, message = "El nombre no puede exceder los 55 caracteres")
    private String name;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 255, message = "La descripción no puede exceder los 255 caracteres")
    private String description;
}
