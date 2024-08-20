package com.senacsf.aquiles.app.dto;

import com.senacsf.aquiles.app.entities.Juries;
import com.senacsf.aquiles.app.entities.Project;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckListSubstantiationListDto {
    private Long checkListId;
    private Long trimester;
    private String item;
    private String observations;
    private boolean rating;
    private Long teamScrumId;
    private Project project;
    private List<Juries> juries;
}
