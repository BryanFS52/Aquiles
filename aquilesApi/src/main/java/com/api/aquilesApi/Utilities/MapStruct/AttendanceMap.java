package com.api.aquilesApi.Utilities.MapStruct;

import com.api.aquilesApi.Dto.AttendancesDto;
import com.api.aquilesApi.Entity.Attendance;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;

@Mapper
public interface AttendanceMap {

    AttendanceMap INSTANCE = Mappers.getMapper(AttendanceMap.class);

    AttendancesDto attendanceToAttendanceDto(Attendance attendance);

    Attendance attendanceDtoToAttendance(AttendancesDto attendancesDto);

    List<AttendancesDto> attendanceToAttendanceDtos(List<Attendance> attendances);

    void updateAttendanceFromDto(AttendancesDto dto, @MappingTarget Attendance entity);

    default Page<AttendancesDto> attendancesToAttendanceDtoPage(Page<Attendance> attendancePage) {
        List<AttendancesDto> dtoList = attendanceToAttendanceDtos(attendancePage.getContent());
        return new PageImpl<>(dtoList, attendancePage.getPageable(), attendancePage.getTotalElements());
    };
}
