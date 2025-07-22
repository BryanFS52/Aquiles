package com.api.aquilesApi.Dto;

import com.api.aquilesApi.Entity.FollowUps;
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

    //Relations
    private JustificationDto justification;
    private AttendanceStateDto attendanceState;
    private StateFollowUpsDto followUps;
}
