package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.AttendanceDto;
import com.api.aquilesApi.Entity.Attendance;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, uses = {FIleMapper.class})
public interface AttendanceMap {
    AttendanceMap INSTANCE = Mappers.getMapper(AttendanceMap.class);

    AttendanceDto EntityToDTO(Attendance attendance);

    Attendance DTOToEntity(AttendanceDto attendance);

    List<AttendanceDto> EntityToDTOs(List<Attendance> attendances);

    void updateAttendance(AttendanceDto attendanceDto, @MappingTarget Attendance attendance);

    default Page<AttendanceDto> EntityToDTOs(Page<Attendance> attendances) {
        List<AttendanceDto> dtos = EntityToDTOs(attendances.getContent());
        return new PageImpl<>(dtos, attendances.getPageable(), attendances.getTotalElements());
    }
}   