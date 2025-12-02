package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.ImprovementPlanDto;
import com.api.aquilesApi.Dto.ImprovementPlanLightDto;
import com.api.aquilesApi.Entity.ImprovementPlan;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, uses =  FIleMapper.class)
public interface ImprovementPlanMap {
    ImprovementPlanMap INSTANCE = Mappers.getMapper(ImprovementPlanMap.class);

    ImprovementPlanDto EntityToDto(ImprovementPlan improvementPlan);
    
    // Método para convertir a DTO light (sin referencias circulares)
    ImprovementPlanLightDto EntityToLightDto(ImprovementPlan improvementPlan);

    ImprovementPlan DtoToEntity(ImprovementPlanDto improvementPlan);

    List<ImprovementPlanDto> EntityToDTOs(List<ImprovementPlan> improvementPlans);

    void updateImprovementPlan(ImprovementPlanDto improvementPlanDto, @MappingTarget ImprovementPlan improvementPlan);

    default Page<ImprovementPlanDto> EntityToDTOs(Page<ImprovementPlan> improvementPlans) {
        List<ImprovementPlanDto> dtos = EntityToDTOs(improvementPlans.getContent());
        return new PageImpl<>(dtos, improvementPlans.getPageable(), improvementPlans.getTotalElements());
    }
}