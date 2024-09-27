package com.senacsf.aquiles.app.dto;

import com.senacsf.aquiles.app.entities.Attendances;
import com.senacsf.aquiles.app.entities.stateAttendance;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttenancesDto {

    private Long attendance_id;

    private Date attendance_date;

    private stateAttendance fk_stateAttendance_id;

}