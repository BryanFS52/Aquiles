package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.ImprovementPlanEvaluationDto;
import com.api.aquilesApi.Entity.ImprovementPlanEvaluation;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ImprovementPlanEvaluationMap {
    ImprovementPlanEvaluationMap INSTANCE = Mappers.getMapper(ImprovementPlanEvaluationMap.class);

    ImprovementPlanEvaluationDto EntityToDto(ImprovementPlanEvaluation improvementPlanEvaluation);

    ImprovementPlanEvaluation DtoToEntity(ImprovementPlanEvaluationDto improvementPlanEvaluationDto);

    List<ImprovementPlanEvaluationDto> EntityToDTOs(List<ImprovementPlanEvaluation> improvementPlanEvaluations);

    void updateImprovementPlanEvaluation(ImprovementPlanEvaluationDto improvementPlanEvaluationDto, @MappingTarget ImprovementPlanEvaluation improvementPlanEvaluation);

    default Page<ImprovementPlanEvaluationDto> EntityToDTOs(Page<ImprovementPlanEvaluation> improvementPlanEvaluations) {
        List<ImprovementPlanEvaluationDto> dtos = EntityToDTOs(improvementPlanEvaluations.getContent());
        return new PageImpl<>(dtos, improvementPlanEvaluations.getPageable(), improvementPlanEvaluations.getTotalElements());
    }
}