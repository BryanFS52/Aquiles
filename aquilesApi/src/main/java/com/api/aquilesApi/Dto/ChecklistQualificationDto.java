package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChecklistQualificationDto {
    private Long id;
    private Boolean qualificationState;
    private String observations;
}
