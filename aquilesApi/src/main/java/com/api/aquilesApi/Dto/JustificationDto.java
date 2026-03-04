package com.api.aquilesApi.Dto;

import com.api.aquilesApi.Dto.Light.AttendanceDTOLight;
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

    private String justificationDate;

    @NotNull(message = "La fecha de ausencia es obligatoria")
    private String absenceDate;

    @NotNull(message = "El estado es obligatorio")
    private Boolean state;

    // Relations
    private JustificationTypeDto justificationType;
    private AttendanceDTOLight attendance;
    private Long notificationId;
    private JustificationStatusDto justificationStatus;
}