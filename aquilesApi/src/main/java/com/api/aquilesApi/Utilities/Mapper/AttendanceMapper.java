//package com.api.aquilesApi.Utilities.Mapper;
//
//import com.api.aquilesApi.Dto.AttendanceDto;
//import com.api.aquilesApi.Entity.Attendance;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//
//import java.util.List;
//
//@Mapper(componentModel = "spring")
//public interface AttendanceMapper {
//
//    @Mapping(source = "attendanceDate", target = "attendanceDate", dateFormat = "yyyy-MM-dd")
//    AttendanceDto toDto(Attendance entity);
//
//    @Mapping(source = "attendanceDate", target = "attendanceDate", dateFormat = "yyyy-MM-dd")
//    Attendance toEntity(AttendanceDto dto);
//
//    List<AttendanceDto> toDtoList(List<Attendance> entities);
//    List<Attendance> toEntityList(List<AttendanceDto> dtos);
//
//    default String map(byte[] value) {
//        return value != null ? new String(value) : null;
//    }
//
//    default byte[] map(String value) {
//        return value != null ? value.getBytes() : null;
//    }
//}
//
