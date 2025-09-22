package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistDto {
    private Long id;

    private Boolean state;

    private String dateAssigned;

    private Long competenceQuarter;

    // Relations
    private List<ItemDto> items;

    private EvaluationDto evaluation;

    private List<TeamsScrumDto> teamsScrum;

    private List<ChecklistQualificationDto> checklistQualifications;
}
