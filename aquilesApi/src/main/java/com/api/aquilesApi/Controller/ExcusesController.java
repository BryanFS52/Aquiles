package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Business.ExcusesBusiness;
import com.api.aquilesApi.Dto.AttendancesDto;
import com.api.aquilesApi.Dto.ExcusesDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class ExcusesController {
    private final ExcusesBusiness excusesBusiness;

    public ExcusesController(ExcusesBusiness excusesBusiness) {
        this.excusesBusiness = excusesBusiness;
    };

    // End-Point Para Traer Todos Las Excusas (GraphQL)
    @QueryMapping
    public Map<String, Object> allExcuses(@Argument int page, @Argument int size) {
        try {
            Page<ExcusesDto> attendancesDtoPage = ExcusesBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    attendancesDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    attendancesDtoPage.getTotalPages(),
                    page,
                    (int) attendancesDtoPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    };

    // End-Point Para Traer Un Attendance Por Id (GraphQL)
    @QueryMapping
    public Map<String, Object> attendanceById(@Argument Long id) {
        try {
            ExcusesDto excusesDto = ExcusesBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    excusesDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    };

    // End-Point Para Crear Un Nuevo Attendance (GraphQL)
    @MutationMapping
    public Map<String, Object> addAttendance(@Argument("input") ExcusesDto excusesDto) {
        try {
            ExcusesDto excusesDto1 = ExcusesBusiness.add(excusesDto);
            return ResponseHttpApi.responseHttpAction(
                    excusesDto1.getExcuseId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        }catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    };

    // End-point para actualizar Attendance (GraphQL)
    @MutationMapping
    public Map<String, Object> updateAttendance(@Argument Long id, @Argument ("input")AttendancesDto attendancesDto) {
        try {
            ExcusesBusiness.update(id, attendancesDto );
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    };

    // End-point para eliminar Attendance (GraphQL)
    @MutationMapping
    public Map<String, Object> deleteAttendance(@Argument Long id) {
        try {
            ExcusesBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    };
}