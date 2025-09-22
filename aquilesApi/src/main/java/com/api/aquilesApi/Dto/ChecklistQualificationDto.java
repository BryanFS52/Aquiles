package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ChecklistQualificationDto {
    private Long id;
    private Boolean qualificationState;
    private String observations;
}
