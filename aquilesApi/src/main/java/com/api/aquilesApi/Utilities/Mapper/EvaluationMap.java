package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.EvaluationDto;
import com.api.aquilesApi.Entity.Evaluation;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, uses = {FIleMapper.class, ItemMap.class, ChecklistMap.class})
public interface EvaluationMap {
    EvaluationMap INSTANCE = Mappers.getMapper(EvaluationMap.class);

    EvaluationDto EntityToDTO(Evaluation evaluation);

    Evaluation DTOToEntity(EvaluationDto evaluation);

    List<EvaluationDto> EntityToDTOs(List<Evaluation> evaluations);

    void updateEvaluation(EvaluationDto evaluationDto, @MappingTarget Evaluation evaluation);

    default Page<EvaluationDto> EntityToDTOs(Page<Evaluation> evaluations) {
        List<EvaluationDto> dtos = EntityToDTOs(evaluations.getContent());
        return new PageImpl<>(dtos, evaluations.getPageable(), evaluations.getTotalElements());
    }
}
