package com.api.aquilesApi.Utilities.Mapper;

import com.api.aquilesApi.Dto.AttendanceStateDto;
import com.api.aquilesApi.Entity.AttendanceState;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import java.util.List;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AttendanceStateMap {
    AttendanceStateMap INSTANCE = Mappers.getMapper(AttendanceStateMap.class);

    AttendanceStateDto EntityToDTO(AttendanceState attendanceState);

    AttendanceState DTOToEntity (AttendanceStateDto attendanceState);

    List<AttendanceStateDto> EntityToDTOs(List<AttendanceState> attendanceStates);

    void updateAttendanceState(AttendanceStateDto attendanceStateDto, @MappingTarget AttendanceState attendanceState);

    default Page<AttendanceStateDto> EntityToDTOs(Page<AttendanceState> stateAttendances) {
        List<AttendanceStateDto> dtos = EntityToDTOs(stateAttendances.getContent());
        return new PageImpl<>(dtos, stateAttendances.getPageable(), stateAttendances.getTotalElements());
    }

}
