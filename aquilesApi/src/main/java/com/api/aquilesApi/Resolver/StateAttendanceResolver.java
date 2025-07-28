package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.StateAttendancesBusiness;
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
public class StateAttendanceResolver {
    private final StateAttendancesBusiness stateAttendancesBusiness;

    public StateAttendanceResolver(StateAttendancesBusiness stateAttendancesBusiness) {
        this.stateAttendancesBusiness = stateAttendancesBusiness;
    }

    // FindAll StateAttendance (GraphQL)
    @DgsQuery
    public Map<String , Object> allStateAttendances (@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<AttendanceStateDto> stateAttendanceDtoPage  = stateAttendancesBusiness.findAll(page, size);
            if (!stateAttendanceDtoPage.isEmpty()){
                return  ResponseHttpApi.responseHttpFindAll(
                        stateAttendanceDtoPage.getContent(),
                        ResponseHttpApi.CODE_OK,
                        "Successfully Completed",
                        stateAttendanceDtoPage.getSize(),
                        stateAttendanceDtoPage.getTotalPages(),
                        (int) stateAttendanceDtoPage.getTotalElements());
            } else {
                return  ResponseHttpApi.responseHttpFindAll(
                        null,
                        ResponseHttpApi.NO_CONTENT,
                        "State Attendance not found",
                        0,
                        0,
                        0);
            }
        } catch (Exception e){
            return  ResponseHttpApi.responseHttpError(
                    "Error getting StateAttendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById StateAttendance (GraphQL)
    @DgsQuery
    public Map<String , Object> stateAttendanceById(@InputArgument Long id){
        try {
            AttendanceStateDto attendanceStateDto = this.stateAttendancesBusiness.findById(id);
            return  ResponseHttpApi.responseHttpFindId(
                    attendanceStateDto,
                    ResponseHttpApi.CODE_OK,
                    "Successfully Completed");
        } catch (Exception e){
            return  ResponseHttpApi.responseHttpError(
                    "Error getting StateAttendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add StateAttendance (GraphQL)
    @DgsMutation
    public Map<String , Object> addStateAttendance(@InputArgument(name = "input") AttendanceStateDto attendanceStateDto){
        try {
            AttendanceStateDto attendanceStateDto1 = stateAttendancesBusiness.add(attendanceStateDto);
            return  ResponseHttpApi.responseHttpAction(
                    attendanceStateDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        }    catch (Exception e) {
            return  ResponseHttpApi.responseHttpError(
                    "Error adding StateAttendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update StateAttendance (GraphQL)
    @DgsMutation
    public Map<String, Object> updateStateAttendance(@InputArgument Long id, @InputArgument(name = "input") AttendanceStateDto attendanceStateDto) {
        try {
            stateAttendancesBusiness.update(id, attendanceStateDto);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        } catch (Exception e) {
            return  ResponseHttpApi.responseHttpError(
                    "Error StateAttendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete StateAttendance (GraphQL)
    @DgsMutation
    public Map<String, Object> deleteStateAttendance(@InputArgument Long id) {
        try {
            stateAttendancesBusiness.delete(id);
            return  ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        } catch (Exception e) {
            return  ResponseHttpApi.responseHttpError(
                    "Error StateAttendance : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}