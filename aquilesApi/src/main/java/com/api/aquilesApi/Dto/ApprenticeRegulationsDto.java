package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprenticeRegulationsDto {
    private Long id;

    @NotBlank
    @Size(max = 80)
    private String title;

    @NotBlank
    @Size(max = 80)
    private String chapter;

    @NotBlank
    private String article;

    @NotBlank
    @Size(max = 80)
    private String paragraph;
}
