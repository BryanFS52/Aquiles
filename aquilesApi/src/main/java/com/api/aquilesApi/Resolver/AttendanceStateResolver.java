package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.AttendanceStateBusiness;
import com.api.aquilesApi.Dto.AttendanceStateDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import java.util.Map;

@DgsComponent
public class AttendanceStateResolver {
    private final AttendanceStateBusiness attendanceStateBusiness;

    public AttendanceStateResolver(AttendanceStateBusiness attendanceStateBusiness) {
        this.attendanceStateBusiness = attendanceStateBusiness;
    }

    // FindAll StateAttendance (GraphQL)
    @DgsQuery
    public Map<String , Object> allStateAttendances (@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<AttendanceStateDto> stateAttendanceDtoPage  = attendanceStateBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    stateAttendanceDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query Ok",
                    stateAttendanceDtoPage.getTotalPages(),
                    page,
                    (int) stateAttendanceDtoPage.getTotalElements()
            );
        } catch (Exception e){
            return  ResponseHttpApi.responseHttpError(
                    "Error getting AttendanceStates: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById StateAttendance (GraphQL)
    @DgsQuery
    public Map<String , Object> stateAttendanceById(@InputArgument Long id){
        try {
            AttendanceStateDto attendanceStateDto = this.attendanceStateBusiness.findById(id);
            return  ResponseHttpApi.responseHttpFindId(
                    attendanceStateDto,
                    ResponseHttpApi.CODE_OK,
                    "Successfully Completed");
        } catch (Exception e){
            return  ResponseHttpApi.responseHttpError(
                    "Error getting AttendanceState: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add StateAttendance (GraphQL)
    @DgsMutation
    public Map<String , Object> addStateAttendance(@InputArgument(name = "input") AttendanceStateDto attendanceStateDto){
        try {
            AttendanceStateDto attendanceStateDto1 = attendanceStateBusiness.add(attendanceStateDto);
            return  ResponseHttpApi.responseHttpAction(
                    attendanceStateDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        }    catch (Exception e) {
            return  ResponseHttpApi.responseHttpError(
                    "Error adding AttendanceState: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update StateAttendance (GraphQL)
    @DgsMutation
    public Map<String, Object> updateStateAttendance(@InputArgument Long id, @InputArgument(name = "input") AttendanceStateDto attendanceStateDto) {
        try {
            attendanceStateBusiness.update(id, attendanceStateDto);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        } catch (Exception e) {
            return  ResponseHttpApi.responseHttpError(
                    "Error AttendanceState: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete StateAttendance (GraphQL)
    @DgsMutation
    public Map<String, Object> deleteStateAttendance(@InputArgument Long id) {
        try {
            attendanceStateBusiness.delete(id);
            return  ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        } catch (Exception e) {
            return  ResponseHttpApi.responseHttpError(
                    "Error AttendanceState : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
