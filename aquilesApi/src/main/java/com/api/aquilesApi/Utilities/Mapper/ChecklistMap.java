package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.ChecklistDto;
import com.api.aquilesApi.Entity.Checklist;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, uses = {FIleMapper.class})
public interface ChecklistMap {
    ChecklistMap INSTANCE = Mappers.getMapper(ChecklistMap.class);

    ChecklistDto EntityToDTO(Checklist checklist);

    Checklist DTOToEntity(ChecklistDto checklist);

    List<ChecklistDto> EntityToDTOs(List<Checklist> checklists);

    void updateChecklist(ChecklistDto checklistDto, @MappingTarget Checklist checklist);

    default Page<ChecklistDto> EntityToDTOs(Page<Checklist> checklists) {
        List<ChecklistDto> dtos = EntityToDTOs(checklists.getContent());
        return new PageImpl<>(dtos, checklists.getPageable(), checklists.getTotalElements());
    }
}
