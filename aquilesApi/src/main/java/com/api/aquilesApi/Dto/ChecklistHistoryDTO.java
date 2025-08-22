package com.api.aquilesApi.Dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class ChecklistHistoryDTO {
    private Long id;
    private Boolean state;
    private String remarks;
    private boolean evaluationCriteria;
    private Date dateAssigned;
    private Long studySheets;
    private Long evaluations;
    private Long learningOutcome;
}
