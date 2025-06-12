package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JustificationDto {
    private Long id;

    @NotNull(message = "El número es obligatorio")
    private String documentNumber;

    @NotNull(message = "El nombre es obligatorio")
    private String name;

    @NotNull(message = "La descripción es obligatoria")
    private String description;

    @NotNull(message = "El archivo es obligatorio")
    private String justificationFile;

    @NotNull(message = "La fecha es obligatoria")
    private String justificationDate;

    @NotNull(message = "El estado es obligatorio")
    private Boolean state;

    @NotNull(message = "El historial es obligatorio")
    private String justificationHistory;

    // Relations
    private JustificationTypeDto justificationTypeId;
    private Long notificationId;


}
