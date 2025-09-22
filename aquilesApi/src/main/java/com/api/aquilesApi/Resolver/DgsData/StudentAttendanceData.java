package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Dto.AttendanceDto;
import com.api.aquilesApi.Dto.Light.AttendanceDTOLight;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;

import java.util.Map;

@DgsComponent
public class StudentAttendanceData {

    @DgsData(parentType = "Attendance", field = "student")
    public Map<String, Object> studentReference(DgsDataFetchingEnvironment env) {

        Object source = env.getSource();

        if (source instanceof AttendanceDto attendanceDto) {
            // Use attendanceDto directly
            if(attendanceDto.getStudentId() == null) return null;
            return Map.of("id", attendanceDto.getStudentId().toString());
        } else if (source instanceof AttendanceDTOLight attendanceDTOLight) {
            // Use attendanceDTOLight accordingly
            if(attendanceDTOLight.getStudentId() == null) return null;
            return Map.of("id", attendanceDTOLight.getStudentId().toString());
        } else {
            // Unknown type or return null
            return null;
        }
    }
}
