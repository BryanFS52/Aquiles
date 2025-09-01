package com.api.aquilesApi.Resolver.DgsData;

import com.api.aquilesApi.Business.AttendancesBusiness;
import com.api.aquilesApi.Dto.TeacherStudySheet;
import com.api.aquilesApi.Entity.Attendance;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;
import org.modelmapper.ModelMapper;

import java.util.List;

@DgsComponent
public class TeacherStudySheetAttendanceData {

    private final AttendancesBusiness attendancesBusiness;

    private final ModelMapper modelMapper;

    public TeacherStudySheetAttendanceData(AttendancesBusiness attendancesBusiness, ModelMapper modelMapper) {
        this.attendancesBusiness = attendancesBusiness;
        this.modelMapper = modelMapper;
    }


    @DgsData(parentType = "TeacherStudySheet")
    public List<Attendance> attendances(DgsDataFetchingEnvironment env){
        TeacherStudySheet teacherStudySheet = env.getSource();
        assert teacherStudySheet != null;

        Long teacherStudySheetId = teacherStudySheet.getId();

        return attendancesBusiness.findAllByStudentId(teacherStudySheetId);

    }
}