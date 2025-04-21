package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApprenticeRegulationsDto implements Serializable {
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
