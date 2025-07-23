package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FollowUpActionDto {
    private Long id;

    @NotNull(message = "El nombre es oblogatorio")
    private String name;

    @NotNull(message = "La descripcion es obligatoria")
    private String description;

    // Relations
    private Long studentId;
}
