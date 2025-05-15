package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationsDto {

    private Long id;

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 55, message = "El título no puede exceder los 55 caracteres")
    private String title;

    @NotBlank(message = "El mensaje es obligatorio")
    @Size(max = 255, message = "El mensaje no puede exceder los 255 caracteres")
    private String message;

    @NotNull(message = "La fecha de envío es obligatoria")
    private Date dateSent;

    @NotNull(message = "El estado es obligatorio")
    private Boolean state;
}
