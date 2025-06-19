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
    private Long studentId;
    private Long studySheetQuarter;
    private JustificationDto justification;
    private AttendanceStateDto attendanceState;
}
