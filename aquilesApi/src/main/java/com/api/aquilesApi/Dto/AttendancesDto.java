package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendancesDto {
    private Long id;
    private String attendanceDate;
    private AttendanceStateDto attendanceState;
    private Long studentId;
}
