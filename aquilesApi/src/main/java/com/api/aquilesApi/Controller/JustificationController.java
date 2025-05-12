package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Business.JustificationBusiness;
import com.api.aquilesApi.Dto.JustificationDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.HttpStatus;

import java.util.Map;

public class JustificationController {
    private final JustificationBusiness justificationBusiness;

    public JustificationController(JustificationBusiness justificationBusiness) {
        this.justificationBusiness = justificationBusiness;
    }

    // FindAll Attendances (GraphQL)
    @QueryMapping
    public Map<String, Object> allJustifications(@Argument int page, @Argument int size) {
        try {
            Page<JustificationDto> justificationDtoPage = justificationBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    justificationDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    justificationDtoPage.getTotalPages(),
                    page,
                    (int) justificationDtoPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById Attendance (GraphQL)
    @QueryMapping
    public Map<String, Object> justificationById(@Argument Long id) {
        try {
            JustificationDto justificationDto = justificationBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    justificationDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new Attendance (GraphQL)
    @MutationMapping
    public Map<String, Object> addJustification(@Argument("input") JustificationDto justificationDto) {
        try {
            JustificationDto justificationDto1 = justificationBusiness.add(justificationDto);
            return ResponseHttpApi.responseHttpAction(
                    justificationDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        }catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding attendance: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update Attendance (GraphQL)
    @MutationMapping
    public Map<String, Object> updateJustification(@Argument Long id, @Argument ("input")JustificationDto justificationDto) {
        try {
            justificationBusiness.update(id, justificationDto );
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
    }

    // Delete Attendance (GraphQL)
    @MutationMapping
    public Map<String, Object> deleteJustification(@Argument Long id) {
        try {
            justificationBusiness.delete(id);
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
    }
}
