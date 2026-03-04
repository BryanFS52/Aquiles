package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Dto.AttendanceDto;
import com.api.aquilesApi.Entity.Attendance;
import com.api.aquilesApi.Utilities.Mapper.AttendanceMap;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;

import java.util.Map;

@DgsComponent
public class AttendanceCompetenceQuarterData {

    @DgsData(parentType = "Attendance")
    public Map<String, Object> competenceQuarter(DgsDataFetchingEnvironment env) {
        try {
            // Obtenemos el source que puede venir como DTO o como entidad
            Object source = env.getSource();
            assert source != null;

            Attendance attendance;
            if (source instanceof AttendanceDto) {
                attendance = AttendanceMap.INSTANCE.DTOToEntity((AttendanceDto) source);
            } else {
                attendance = (Attendance) source;
            }

            if (attendance == null || attendance.getCompetenceQuarter() == null) {
                return null;
            }

            return Map.of("id", attendance.getCompetenceQuarter());
        } catch (Exception e) {
            System.out.println("Error getting Attendance: ");
            throw new RuntimeException("Error getting Attendance: " + e.getMessage());
        }
    }
}
