package com.api.aquilesApi.Dto;

import com.api.aquilesApi.Entity.Checklist;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationsDto {
    private Long id;

    
    public EvaluationsDto(Long id, String observations, String recommendations, String valueJudgment, Long checklistId) {
        this.id = id;
        this.observations = observations;
        this.recommendations = recommendations;
        this.valueJudgment = valueJudgment;
        this.checklistId = checklistId;
    }
    
    @NotBlank(message = "Las observaciones son obligatorias")
    @Size(max = 500, message = "Las observaciones no pueden exceder los 500 caracteres")
    private String observations;

    @Size(max = 255, message = "Las recomendaciones no pueden exceder los 255 caracteres")
    private String recommendations;

    @NotBlank(message = "El juicio de valor es obligatorio")
    @Size(max = 13, message = "El juicio de valor no puede exceder los 13 caracteres")
    private String valueJudgment;

    // Relations

    @OneToOne
    @JoinColumn(name = "checklist_id", referencedColumnName = "id")
    private Checklist checklist;

    private Long checklistId;

    public Long getChecklistId() {
        return checklistId;
    }

    public void setChecklistId(Long checklistId) {
        this.checklistId = checklistId;
    }
}
