package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamsScrumDto {
    private Long id;
    private String name;
    private String members;
    private Long checklistId;
    private Long teamScrumId;
}
