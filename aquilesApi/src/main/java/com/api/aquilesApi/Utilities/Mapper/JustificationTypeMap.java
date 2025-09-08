package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.JustificationTypeDto;
import com.api.aquilesApi.Entity.JustificationType;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface JustificationTypeMap {
    JustificationTypeMap INSTANCE = Mappers.getMapper(JustificationTypeMap.class);

    JustificationTypeDto EntityToDTO(JustificationTypeDto justificationType);

    JustificationType DTOToEntity(JustificationTypeDto justificationType);

    List<JustificationTypeDto> EntityToDTOs(List<JustificationType> justificationType);

    void updateJustificationType(JustificationTypeDto justificationTypeDto,  @MappingTarget JustificationType justificationType);

    default Page<JustificationTypeDto> EntityToDTOs(Page<JustificationType> justificationType) {
        List<JustificationTypeDto> dtos = EntityToDTOs(justificationType.getContent());
        return new PageImpl<>(dtos, justificationType.getPageable(), justificationType.getTotalElements());
    }
}