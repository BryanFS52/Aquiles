package com.senacsf.aquiles.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDetailsDto {
    private String description;
    private String problem;
    private String objectives;
    private String justification;
    private String nameProject;
}
