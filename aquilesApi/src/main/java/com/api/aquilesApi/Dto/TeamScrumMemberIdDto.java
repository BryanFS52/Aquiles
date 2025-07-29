package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamScrumMemberIdDto {
    // @NotNull(message = "")
    private Long studentId;
    // @NotNull(message = "")
    private String profileId;
}
