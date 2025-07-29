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

    @NotNull(message = "La descripción es obligatoria")
    private String description;

    @NotNull(message = "El archivo es obligatorio")
    private String justificationFile;

    @NotNull(message = "La fecha es obligatoria")
    private String justificationDate;

    @NotNull(message = "El estado es obligatorio")
    private Boolean state;

    // Relations
    private JustificationTypeDto justificationType;
    private AttendanceDto attendance;
    private Long notificationId;
}