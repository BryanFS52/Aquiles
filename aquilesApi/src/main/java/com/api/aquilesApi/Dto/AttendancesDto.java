package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendancesDto {

    private Long id;
    // @NotNull(message = "")
    private String attendanceDate;

    // @NotNull(message = "")
    private Long studentId;

    // @NotNull(message = "")
    private Long studySheetQuarter;
    private JustificationDto justification;

    // @NotNull(message = "")
    private AttendanceStateDto attendanceState;}
