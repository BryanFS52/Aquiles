package com.api.aquilesApi.Dto;

import com.api.aquilesApi.Entity.JuriesEntity;
import com.api.aquilesApi.Entity.ProjectEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistSubstantiationListDto {
    private Long checkListId;
    private Long trimester;
    private String item;
    private String observations;
    private boolean rating;
    private Long teamScrumId;
    private ProjectEntity project;
    private List<JuriesEntity> juries;
}
