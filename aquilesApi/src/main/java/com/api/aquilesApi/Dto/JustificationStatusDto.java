package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JustificationStatusDto {

    // @NotNull(message = "")
    private Long id;
    // @NotNull(message = "")
    private String name;
    // @NotNull(message = "")
    private boolean state;
}