package com.api.aquilesApi.Dto;

import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Entity.ItemType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemDto {

    private Long id;

    @NotBlank(message = "El código es obligatorio")
    @Size(max = 15, message = "El código no puede exceder los 15 caracteres")
    private String code;

    @NotBlank(message = "El indicador es obligatorio")
    @Size(max = 100, message = "El indicador no puede exceder los 100 caracteres")
    private String indicator;

    @NotBlank(message = "El tipo de ítem es obligatorio")
    private Boolean state = true;

    // Relations
    private ItemType itemType;

    private Checklist checklist;
}