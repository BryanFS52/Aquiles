package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.JustificationDto;
import com.api.aquilesApi.Entity.Justification;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,uses = {FIleMapper.class})
public interface JustificationMap {
    JustificationMap INSTANCE = Mappers.getMapper(JustificationMap.class);

    JustificationDto EntityToDTO(Justification justification);

    Justification DTOToEntity(JustificationDto justification);

    List<JustificationDto> EntityToDTOs(List<Justification> justifications);

    default Page<JustificationDto> EntityToDTOs(Page<Justification> justifications) {
        List<JustificationDto> dtos = EntityToDTOs(justifications.getContent());
        return new PageImpl<>(dtos, justifications.getPageable(), justifications.getTotalElements());
    }
}
