package com.api.aquilesApi.Dto;

import com.api.aquilesApi.Dto.Light.JustificationDTOLight;
import  lombok.AllArgsConstructor;
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
    private Long competenceQuarter;

    // @NotNull(message = "")
    private JustificationDTOLight justification;

    // @NotNull(message = "")
    private AttendanceStateDto attendanceState;

}