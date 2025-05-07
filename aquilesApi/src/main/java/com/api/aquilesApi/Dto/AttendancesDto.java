package com.api.aquilesApi.Dto;

import com.api.aquilesApi.Entity.StateAttendanceEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendancesDto implements Serializable {
    private Long attendanceId;
    private String attendanceDate;
    private StateAttendanceEntity stateAttendance;
}
