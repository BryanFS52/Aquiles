package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinalReportDto implements Serializable {

    private Long id;

    @NotBlank(message = "El número de archivo es obligatorio")
    @Size(max = 55, message = "El número de archivo no puede exceder los 55 caracteres")
    private String fileNumber;

    @NotBlank(message = "Los objetivos son obligatorios")
    @Size(max = 255, message = "Los objetivos no pueden exceder los 255 caracteres")
    private String objectives;

    @Size(max = 255, message = "Las ofensas disciplinarias no pueden exceder los 255 caracteres")
    private String disciplinaryOffenses;

    @NotBlank(message = "Las conclusiones son obligatorias")
    @Size(max = 255, message = "Las conclusiones no pueden exceder los 255 caracteres")
    private String conclusions;

    private byte[] annexes;

    @NotNull(message = "La firma es obligatoria")
    private byte[] signature;

    @NotNull(message = "El estado es obligatorio")
    private Boolean state;

    private Date createdAt;

    // Relations
}
