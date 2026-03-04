package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Dto.AttendanceDto;
import com.api.aquilesApi.Dto.FinalReportDto;
import com.api.aquilesApi.Entity.Attendance;
import com.api.aquilesApi.Entity.FinalReport;
import com.api.aquilesApi.Utilities.Mapper.AttendanceMap;
import com.api.aquilesApi.Utilities.Mapper.FinalReportMap;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;

import java.util.Map;

@DgsComponent
public class FinalReportCompetenceQuarterData {

    @DgsData(parentType = "FinalReport")
    public Map<String, Object> competenceQuarter(DgsDataFetchingEnvironment env) {
        try {
            // Obtenemos el source que puede venir como DTO o como entidad
            Object source = env.getSource();
            assert source != null;

            FinalReport finalReport;
            if (source instanceof FinalReportDto) {
                finalReport = FinalReportMap.INSTANCE.DTOToEntity((FinalReportDto) source);
            } else {
                finalReport = (FinalReport) source;
            }

            if (finalReport == null || finalReport.getCompetenceQuarter() == null) {
                return null;
            }

            return Map.of("id", finalReport.getCompetenceQuarter());
        } catch (Exception e) {
            System.out.println("Error getting finalReport: ");
            throw new RuntimeException("Error getting finalReport: " + e.getMessage());
        }
    }
}
