package com.api.aquilesApi.Dto;

import com.api.aquilesApi.Entity.Juries;
import com.api.aquilesApi.Entity.Project;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistSubstantiationListDTO {
    private Long checkListId;
    private Long trimester;
    private String item;
    private String observations;
    private boolean rating;
    private Long teamScrumId;
    private Project project;
    private List<Juries> juries;
}
