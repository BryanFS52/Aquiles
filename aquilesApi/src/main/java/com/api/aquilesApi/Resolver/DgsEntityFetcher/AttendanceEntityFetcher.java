package com.api.aquilesApi.Resolver.DgsEntityFetcher;

import com.api.aquilesApi.Business.AttendancesBusiness;
import com.api.aquilesApi.Dto.AttendanceDto;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsEntityFetcher;
import java.util.Map;

@DgsComponent
public class AttendanceEntityFetcher {
    private final AttendancesBusiness attendancesBusiness;

    public AttendanceEntityFetcher(AttendancesBusiness attendancesBusiness) {
        this.attendancesBusiness = attendancesBusiness;
    }

    @DgsEntityFetcher(name = "Attendance")
    public AttendanceDto getAttendance(Map<String, Object> values) {
        String id = (String) values.get("id");
        Long attendanceId = id != null ? Long.valueOf(id) : null;
        return attendancesBusiness.findById(attendanceId);
    }
}