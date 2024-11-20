package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentTypeDTO {

    private Long id;

    @NotNull(message = "El nombre es obligatorio")
    @Size(max = 50, message = "El nombre no puede exceder los 50 caracteres")
    private String name;

    @NotNull(message = "El acrónimo es obligatorio")
    @Size(max = 5, message = "El acrónimo no puede exceder los 5 caracteres")
    private String acronym;

    @NotNull(message = "El estado es obligatorio")
    private Boolean state;

    private Date createdAt;
    private Date updatedAt;
}
