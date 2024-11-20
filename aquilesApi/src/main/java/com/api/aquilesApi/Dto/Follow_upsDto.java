package com.api.aquilesApi.Dto;

import com.api.aquilesApi.Entity.StateFollow_upsEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Follow_upsDto {
    private Long followUpId;
    private StateFollow_upsEntity stateFollowUps;
}
