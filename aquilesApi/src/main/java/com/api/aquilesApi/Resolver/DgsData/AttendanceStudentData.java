package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Business.AttendancesBusiness;
import com.api.aquilesApi.Dto.Student;
import com.api.aquilesApi.Entity.Attendance;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;
import java.util.Collections;
import java.util.List;

@DgsComponent
public class AttendanceStudentData {
    private final AttendancesBusiness attendancesBusiness;

    public AttendanceStudentData(AttendancesBusiness attendancesBusiness) {
        this.attendancesBusiness = attendancesBusiness;
    }

    @DgsData(parentType = "Student", field = "attendances")
    public List<Attendance> getAttendances(DgsDataFetchingEnvironment env) {
        Student student = env.getSource();
        assert student != null;
        Long studentId = student.getId();

        Long competenceQuarterId = env.getArgument("competenceQuarterId");
        List<Attendance> attendanceList;

        if (competenceQuarterId != null) {
            attendanceList = attendancesBusiness.getAllByStudentIdAndCompetenceQuarter(studentId, competenceQuarterId);
        } else {
            attendanceList = attendancesBusiness.findAllByStudentId(studentId);
        }

        return attendanceList != null ? attendanceList : Collections.emptyList();
    }
}
