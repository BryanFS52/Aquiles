package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationsDto implements Serializable {
    private Long id;

    @NotBlank(message = "Las observaciones son obligatorias")
    @Size(max = 500, message = "Las observaciones no pueden exceder los 500 caracteres")
    private String observations;

    @Size(max = 255, message = "Las recomendaciones no pueden exceder los 255 caracteres")
    private String recommendations;

    @NotBlank(message = "El juicio de valor es obligatorio")
    @Size(max = 13, message = "El juicio de valor no puede exceder los 13 caracteres")
    private String valueJudgment;

    // Relations
}
