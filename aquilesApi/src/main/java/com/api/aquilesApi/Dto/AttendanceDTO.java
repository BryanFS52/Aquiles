package com.api.aquilesApi.Dto;

import com.api.aquilesApi.Entity.StateAttendance;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDTO implements Serializable {
    private Long attendanceId;
    private Date attendanceDate;
    private StateAttendance stateAttendance; // La propiedad se mantiene igual, solo se cambió el nombre de la clase
}
