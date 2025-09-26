package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistHistoryDto {
    private Long id;
    private Boolean state;
    private String remarks;
    private boolean evaluationCriteria;
    private String dateAssigned;
    private String studySheets;
    private Long trainingProjectId;
    private String trainingProjectName;
    private Long evaluations;
    private Long learningOutcome;
}
