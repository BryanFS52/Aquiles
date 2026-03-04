package com.api.aquilesApi.Dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProcessMethodologyDto {
    private Long teamScrumId;
    private String profileId;
    private Long studentId;
    private Boolean isActive;
    private Boolean isUnique;
}
