package com.api.aquilesApi.Dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.*;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonKeyDTO {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("document")
    @NotNull(message = "El documento de identidad es obligatorio")
    private Long document;
}
