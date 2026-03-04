package com.api.aquilesApi.Dto.Light;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO "light" de ImprovementPlan sin referencias circulares
 * Se usa para evitar bucles infinitos cuando se incluye en otros DTOS
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImprovementPlanLightDto implements Serializable {

    private Long id;
    private String actNumber;
    private String city;
    private String date;
    private String startTime;
    private String endTime;
    private String place;
    private String reason;
    private Boolean state;
    private String additionalJustification;
    
    // Reference IDs only
    private Long studentId;
    private Long teacherCompetence;
    private Long learningOutcome;
    
    // NO incluir improvementPlanEvaluation para evitar referencia circular
}
