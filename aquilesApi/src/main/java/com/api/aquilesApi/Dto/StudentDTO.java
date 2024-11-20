package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDTO {

    private Long id;

    @NotNull(message = "El estado es obligatorio")
    private Boolean state;

    private Date createdAt;
    private Date updatedAt;

    // Relaciones
    @NotNull(message = "La persona es obligatoria")
    private PersonDTO person; // Cambiar a la clase PersonDTO de Aquiles, si está en un paquete diferente.

    @NotNull(message = "La ficha es obligatoria")
    private StudySheetDTO studySheet; // Cambiar a la clase StudySheetDTO de Aquiles, si está en un paquete diferente.
}
