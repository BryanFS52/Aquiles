package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Dto.AttendanceDto;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;
import java.util.Map;

@DgsComponent
public class StudentAttendanceData {

    @DgsData(parentType = "Attendance", field = "student")
    public Map<String, Object> studentReference(DgsDataFetchingEnvironment env) {
        AttendanceDto attendanceDto = env.getSource();
        assert attendanceDto != null;
        if(attendanceDto.getStudentId() == null) return null;
        return Map.of("id", attendanceDto.getStudentId().toString());
    }
}
