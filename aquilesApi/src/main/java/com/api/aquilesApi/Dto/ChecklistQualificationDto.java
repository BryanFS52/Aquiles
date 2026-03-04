package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChecklistQualificationDto {
    private Long id;
    private Boolean qualificationState;
    private String observations;
    private Long itemId;
    private Long teamScrumId;
    private Long checklistId;
}
