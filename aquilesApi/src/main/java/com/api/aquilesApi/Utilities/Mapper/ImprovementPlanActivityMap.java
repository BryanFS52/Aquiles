package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.ImprovementPlanActivityDto;
import com.api.aquilesApi.Entity.ImprovementPlanActivity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, uses = {FIleMapper.class})
public interface ImprovementPlanActivityMap {
    ImprovementPlanActivityMap INSTANCE = Mappers.getMapper(ImprovementPlanActivityMap.class);

    ImprovementPlanActivityDto EntityToDTO(ImprovementPlanActivity improvementPlanActivity);

    ImprovementPlanActivity DTOToEntity(ImprovementPlanActivityDto improvementPlanActivity);

    List<ImprovementPlanActivityDto> EntityToDTOs(List<ImprovementPlanActivity> improvementPlanActivities);

    void updateImprovementPlanActivity(ImprovementPlanActivityDto improvementPlanActivityDto, @MappingTarget ImprovementPlanActivity improvementPlanActivity);

    default Page<ImprovementPlanActivityDto> EntityToDTOs(Page<ImprovementPlanActivity> improvementPlanActivities) {
        List<ImprovementPlanActivityDto> dtos = EntityToDTOs(improvementPlanActivities.getContent());
        return new PageImpl<>(dtos, improvementPlanActivities.getPageable(), improvementPlanActivities.getTotalElements());
    }
}