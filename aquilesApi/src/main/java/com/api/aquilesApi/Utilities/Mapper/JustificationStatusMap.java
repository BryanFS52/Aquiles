package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.JustificationStatusDto;
import com.api.aquilesApi.Entity.JustificationStatus;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
public interface JustificationStatusMap {

    JustificationStatusMap INSTANCE = Mappers.getMapper(JustificationStatusMap.class);

    JustificationStatusDto EntityToDTO(JustificationStatus justificationStatus);

    JustificationStatus DTOToEntity(JustificationStatusDto justificationStatusDto);

    List<JustificationStatusDto> EntityToDTOs(List<JustificationStatus> justificationStatuses);

    void updateJustificationStatus(JustificationStatusDto justificationStatusDto, @MappingTarget JustificationStatus justificationStatus);

    default Page<JustificationStatusDto> EntityToDTOs(Page<JustificationStatus> justificationStatus) {
        List<JustificationStatusDto> dtos = EntityToDTOs(justificationStatus.getContent());
        return new PageImpl<>(dtos, justificationStatus.getPageable(), justificationStatus.getTotalElements());
    }
}
