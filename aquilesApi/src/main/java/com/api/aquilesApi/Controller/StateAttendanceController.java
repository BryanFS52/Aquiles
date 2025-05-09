package com.api.aquilesApi.Controller;


import com.api.aquilesApi.Business.StateAttendancesBusiness;
import com.api.aquilesApi.Dto.StateAttendanceDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class StateAttendanceController {
    private final StateAttendancesBusiness stateAttendancesBusiness;

    public StateAttendanceController(StateAttendancesBusiness stateAttendancesBusiness) {
        this.stateAttendancesBusiness = stateAttendancesBusiness;
    }

    @QueryMapping
    public Map<String , Object> findAll (@Argument int page, @Argument int size) {
        try {
            Page<StateAttendanceDto> stateAttendanceDtoPage  = stateAttendancesBusiness.findAll(page, size);
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
                    "Error getting State Attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //End-Point Para Traer Un Estado Por Id
    @QueryMapping
    public Map<String , Object> findById(@Argument Long id){
        try {
            StateAttendanceDto stateAttendanceDto = this.stateAttendancesBusiness.findById(id);
            return  ResponseHttpApi.responseHttpFindId(
                    stateAttendanceDto,
                    ResponseHttpApi.CODE_OK,
                    "Successfully Completed");
        } catch (Exception e){
            return  ResponseHttpApi.responseHttpError(
                    "Error getting State Attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Metodo Para Crear-Add Un Estado De Asistencia
    @MutationMapping
    public Map<String , Object> add (@Argument("input")StateAttendanceDto stateAttendanceDto){
        try {
            StateAttendanceDto stateAttendanceDto1 = stateAttendancesBusiness.add(stateAttendanceDto);
            return  ResponseHttpApi.responseHttpAction(
                    stateAttendanceDto1.getStateAttendanceId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        }    catch (Exception e) {
            return  ResponseHttpApi.responseHttpError(
                    "Error adding  State Attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Metodo Para Actualizar Un Estado De Asistencia
    @MutationMapping
    public Map<String, Object> update(@Argument Long id, @Argument StateAttendanceDto stateAttendanceDto) {
        try {
            stateAttendancesBusiness.update(id, stateAttendanceDto);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        } catch (Exception e) {
            return  ResponseHttpApi.responseHttpError(
                    "Error State Attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Metodo Para Eliminar Un Estado Asistencia
    @MutationMapping
    public Map<String, Object> delete(@Argument Long id) {
        try {
            stateAttendancesBusiness.delete(id);
            return  ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        } catch (Exception e) {
            return  ResponseHttpApi.responseHttpError(
                    "Error State Attendance : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
