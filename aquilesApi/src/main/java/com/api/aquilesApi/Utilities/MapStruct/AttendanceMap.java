package com.api.aquilesApi.Utilities.MapStruct;

import com.api.aquilesApi.Dto.AttendanceDto;
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

    AttendanceDto attendanceToAttendanceDto(Attendance attendance);

    Attendance attendanceDtoToAttendance(AttendanceDto attendanceDto);

    List<AttendanceDto> attendanceToAttendanceDtos(List<Attendance> attendances);

    void updateAttendanceFromDto(AttendanceDto dto, @MappingTarget Attendance entity);

    default Page<AttendanceDto> attendancesToAttendanceDtoPage(Page<Attendance> attendancePage) {
        List<AttendanceDto> dtoList = attendanceToAttendanceDtos(attendancePage.getContent());
        return new PageImpl<>(dtoList, attendancePage.getPageable(), attendancePage.getTotalElements());
    };
}
