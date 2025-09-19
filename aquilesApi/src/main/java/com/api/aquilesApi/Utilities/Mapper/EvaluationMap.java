package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.EvaluationDto;
import com.api.aquilesApi.Entity.Evaluations;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, uses = {FIleMapper.class})
public interface EvaluationMap {
    EvaluationMap INSTANCE = Mappers.getMapper(EvaluationMap.class);

    EvaluationDto EntityToDTO(Evaluations evaluation);

    Evaluations DTOToEntity(EvaluationDto evaluation);

    List<EvaluationDto> EntityToDTOs(List<Evaluations> evaluations);

    void updateEvaluation(EvaluationDto evaluationDto, @MappingTarget Evaluations evaluation);

    default Page<EvaluationDto> EntityToDTOs(Page<Evaluations> evaluations) {
        List<EvaluationDto> dtos = EntityToDTOs(evaluations.getContent());
        return new PageImpl<>(dtos, evaluations.getPageable(), evaluations.getTotalElements());
    }
}
