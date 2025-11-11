package com.api.aquilesApi.Dto;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ImprovementPlanDto implements Serializable {

    private Long id;

    private String actNumber;
    private String city;
    private String date;
    private String startTime;
    private String endTime;
    private String place;
    private String reason;
    private String objectives;
    private Boolean state;
    private String conclusions;
    private Boolean qualification;

    // Reference IDs
    private Long studentId;
    private Long teacherCompetence;
    private Long learningOutcome;

    private byte[] improvementPlanFile;

        // Relations
    private List<ImprovementPlanActivityDto> improvementPlanActivity;
    private ImprovementPlanFaultTypeDto faultType;
    private ImprovementPlanEvaluationDto improvementPlanEvaluation;
}
