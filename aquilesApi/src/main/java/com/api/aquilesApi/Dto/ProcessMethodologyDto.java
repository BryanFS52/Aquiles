package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProcessMethodologyDto {
    private Long teamScrumId;
    private String profileId;
    private Long studentId;
    private Boolean isActive;
    private Boolean isUnique;
}
