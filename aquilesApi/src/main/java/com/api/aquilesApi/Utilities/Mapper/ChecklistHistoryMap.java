package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.ChecklistHistoryDto;
import com.api.aquilesApi.Entity.Checklist;
import com.api.aquilesApi.Entity.ChecklistHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,uses = {FIleMapper.class})
public interface ChecklistHistoryMap {

    ChecklistHistoryMap INSTANCE = Mappers.getMapper(ChecklistHistoryMap.class);

    ChecklistHistoryDto EntityToDTO(ChecklistHistory checklistHistory);

    ChecklistHistory DTOToEntity(ChecklistHistoryDto checklistHistory);

    List<ChecklistHistoryDto> EntityToDTOs(List<ChecklistHistory> checklistHistories);

    void updateChecklistHistory(ChecklistHistoryDto checklistHistoryDto, @MappingTarget ChecklistHistory checklistHistory);

    @Mapping(target = "evaluations", ignore = true)
    @Mapping(target = "trainingProjectName", ignore = true)
    ChecklistHistoryDto checklistToHistoryDto(Checklist checklist);

    default Page<ChecklistHistoryDto> EntityToDTOs(Page<ChecklistHistory> checklistHistories) {
        List<ChecklistHistoryDto> dtos = EntityToDTOs(checklistHistories.getContent());
        return new PageImpl<>(dtos, checklistHistories.getPageable(), checklistHistories.getTotalElements());
    }
}
