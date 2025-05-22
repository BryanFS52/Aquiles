package com.api.aquilesApi.Dto;

import com.api.aquilesApi.Entity.StateAttendanceEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendancesDto {
    private Long attendanceId;

    private String attendanceDate;

    private StateAttendanceEntity stateAttendance;


}
