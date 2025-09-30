package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.FinalReportDto;
import com.api.aquilesApi.Entity.FinalReport;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, uses = {FIleMapper.class})
public interface FinalReportMap {
    FinalReportMap INSTANCE = Mappers.getMapper(FinalReportMap.class);

    FinalReportDto EntityToDTO(FinalReport finalReport);

    FinalReport DTOToEntity(FinalReportDto finalReport);

    List<FinalReportDto> EntityToDTOs(List<FinalReport> finalReports);

    void updateFinalReport(FinalReportDto finalReportDto, @MappingTarget FinalReport finalReport);

    default Page<FinalReportDto> EntityToDTOs(Page<FinalReport> finalReports) {
        List<FinalReportDto> dtos = EntityToDTOs(finalReports.getContent());
        return new PageImpl<>(dtos, finalReports.getPageable(), finalReports.getTotalElements());
    }
}
