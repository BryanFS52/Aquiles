package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.ChecklistQualificationDto;
import com.api.aquilesApi.Entity.ChecklistQualification;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;

@Mapper()
public interface ChecklistQualificationMap {
    ChecklistQualificationMap INSTANCE = Mappers.getMapper(ChecklistQualificationMap.class);

    ChecklistQualificationDto EntityToDTO(ChecklistQualification checklistQualification);

    ChecklistQualification DTOToEntity(ChecklistQualificationDto checklistQualification);

    List<ChecklistQualificationDto> EntityToDTOs(List<ChecklistQualification> checklistQualifications);

    void updateChecklistQualification(ChecklistQualificationDto checklistQualificationDto, @MappingTarget ChecklistQualification checklistQualification);

    default Page<ChecklistQualificationDto> EntityToDTOs(Page<ChecklistQualification> checklistQualifications) {
        List<ChecklistQualificationDto> dtos = EntityToDTOs(checklistQualifications.getContent());
        return new PageImpl<>(dtos, checklistQualifications.getPageable(), checklistQualifications.getTotalElements());
    }
}
