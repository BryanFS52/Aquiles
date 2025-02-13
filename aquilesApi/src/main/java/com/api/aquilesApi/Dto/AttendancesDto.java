package com.api.aquilesApi.Dto;

import com.api.aquilesApi.Entity.StateAttendanceEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendancesDto implements Serializable {
    private Long attendanceId;
    private Date attendanceDate;
    private StateAttendanceEntity stateAttendance; // Cambiar a este nombre
}
