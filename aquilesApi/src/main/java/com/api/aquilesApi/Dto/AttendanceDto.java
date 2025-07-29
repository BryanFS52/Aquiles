package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDto {

    private Long id;
    // @NotNull(message = "")
    private String attendanceDate;

    // @NotNull(message = "")
    private Long studentId;

    // @NotNull(message = "")
    private Long studySheetQuarter;

    // @NotNull(message = "")
    private JustificationDto justification;

    // @NotNull(message = "")
    private AttendanceStateDto attendanceState;
}
