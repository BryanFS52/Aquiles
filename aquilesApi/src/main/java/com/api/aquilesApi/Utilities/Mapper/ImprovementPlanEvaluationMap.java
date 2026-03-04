package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.ImprovementPlanEvaluationDto;
import com.api.aquilesApi.Dto.Light.ImprovementPlanLightDto;
import com.api.aquilesApi.Entity.ImprovementPlan;
import com.api.aquilesApi.Entity.ImprovementPlanEvaluation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ImprovementPlanEvaluationMap {
    ImprovementPlanEvaluationMap INSTANCE = Mappers.getMapper(ImprovementPlanEvaluationMap.class);

    // Mapeo de Entity a DTO usando el método personalizado para evitar ciclo infinito
    @Mapping(target = "improvementPlan", source = "improvementPlan", qualifiedByName = "improvementPlanToLightDto")
    ImprovementPlanEvaluationDto EntityToDto(ImprovementPlanEvaluation improvementPlanEvaluation);

    ImprovementPlanEvaluation DtoToEntity(ImprovementPlanEvaluationDto improvementPlanEvaluationDto);

    List<ImprovementPlanEvaluationDto> EntityToDTOs(List<ImprovementPlanEvaluation> improvementPlanEvaluations);

    void updateImprovementPlanEvaluation(ImprovementPlanEvaluationDto improvementPlanEvaluationDto, @MappingTarget ImprovementPlanEvaluation improvementPlanEvaluation);

    default Page<ImprovementPlanEvaluationDto> EntityToDTOs(Page<ImprovementPlanEvaluation> improvementPlanEvaluations) {
        List<ImprovementPlanEvaluationDto> dtos = EntityToDTOs(improvementPlanEvaluations.getContent());
        return new PageImpl<>(dtos, improvementPlanEvaluations.getPageable(), improvementPlanEvaluations.getTotalElements());
    }
    
    // Método helper para convertir ImprovementPlan a ImprovementPlanLightDto
    @Named("improvementPlanToLightDto")
    default ImprovementPlanLightDto improvementPlanToLightDto(ImprovementPlan improvementPlan) {
        if (improvementPlan == null) {
            return null;
        }
        return ImprovementPlanLightDto.builder()
                .id(improvementPlan.getId())
                .actNumber(improvementPlan.getActNumber())
                .city(improvementPlan.getCity())
                .date(improvementPlan.getDate() != null ? improvementPlan.getDate().toString() : null)
                .startTime(improvementPlan.getStartTime() != null ? improvementPlan.getStartTime().toString() : null)
                .endTime(improvementPlan.getEndTime() != null ? improvementPlan.getEndTime().toString() : null)
                .place(improvementPlan.getPlace())
                .reason(improvementPlan.getReason())
                .state(improvementPlan.getState())
                .additionalJustification(improvementPlan.getAdditionalJustification())
                .studentId(improvementPlan.getStudentId())
                .teacherCompetence(improvementPlan.getTeacherCompetence())
                .learningOutcome(improvementPlan.getLearningOutcome())
                .build();
    }
}