package com.api.aquilesApi.Dto.Light;

import com.api.aquilesApi.Dto.AttendanceStateDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceDTOLight {
    private Long id;

    private String attendanceDate;

    private Long studentId;

    private Long competenceQuarter;

    private AttendanceStateDto attendanceState;
}
