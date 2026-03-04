package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.ChecklistQualificationDto;
import com.api.aquilesApi.Entity.ChecklistQualification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;

@Mapper()
public interface ChecklistQualificationMap {
    ChecklistQualificationMap INSTANCE = Mappers.getMapper(ChecklistQualificationMap.class);

    @Mapping(source = "item.id", target = "itemId")
    @Mapping(source = "teamsScrum.id", target = "teamScrumId")
    @Mapping(source = "checklist.id", target = "checklistId")
    ChecklistQualificationDto EntityToDTO(ChecklistQualification checklistQualification);

    @Mapping(target = "item", ignore = true)
    @Mapping(target = "teamsScrum", ignore = true)
    @Mapping(target = "checklist", ignore = true)
    ChecklistQualification DTOToEntity(ChecklistQualificationDto checklistQualification);

    List<ChecklistQualificationDto> EntityToDTOs(List<ChecklistQualification> checklistQualifications);

    @Mapping(target = "item", ignore = true)
    @Mapping(target = "teamsScrum", ignore = true)
    @Mapping(target = "checklist", ignore = true)
    void updateChecklistQualification(ChecklistQualificationDto checklistQualificationDto, @MappingTarget ChecklistQualification checklistQualification);

    default Page<ChecklistQualificationDto> EntityToDTOs(Page<ChecklistQualification> checklistQualifications) {
        List<ChecklistQualificationDto> dtos = EntityToDTOs(checklistQualifications.getContent());
        return new PageImpl<>(dtos, checklistQualifications.getPageable(), checklistQualifications.getTotalElements());
    }
}
