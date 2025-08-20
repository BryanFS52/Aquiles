package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.JustificationBusiness;
import com.api.aquilesApi.Dto.JustificationDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import org.springframework.data.domain.Page;
import com.netflix.graphql.dgs.InputArgument;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

@DgsComponent
public class JustificationResolver {
    private final JustificationBusiness justificationBusiness;

    public JustificationResolver(JustificationBusiness justificationBusiness) {
        this.justificationBusiness = justificationBusiness;
    }

    // FindAll Justifications (GraphQL)
    @DgsQuery
    public Map<String, Object> allJustifications(@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<JustificationDto> justificationDtoPage = justificationBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    justificationDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    justificationDtoPage.getTotalPages(),
                    justificationDtoPage.getNumber(),
                    (int) justificationDtoPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving Justifications: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById Justification (GraphQL)
    @DgsQuery
    public Map<String, Object> justificationById(@InputArgument Long id) {
        try {
            JustificationDto justificationDto = justificationBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    justificationDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving Justification: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Find Justification by attendance by studentID (GraphQL)
    @DgsQuery
    public Map<String, Object> justificationByStudentId(@InputArgument Long studentId) {
        try {
            List<JustificationDto> justificationDtos = justificationBusiness.findByStudentId(studentId);
            return ResponseHttpApi.responseHttpFindAll(
                    justificationDtos,
                    ResponseHttpApi.CODE_OK,
                    "Query by studentId ok",
                    1,
                    0,
                    justificationDtos.size()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving Justifications by Student ID: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new Justification (GraphQL)
    @DgsMutation
    public Map<String, Object> addJustification(@InputArgument(name = "input") JustificationDto justificationDto) {
        try {
            JustificationDto result = justificationBusiness.add(justificationDto);

            return ResponseHttpApi.responseHttpAction(
                    result.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding Justification: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update Justification (GraphQL)
    @DgsMutation
    public Map<String, Object> updateJustification(@InputArgument Long id, @InputArgument (name = "input")JustificationDto justificationDto) {
        try {
            justificationBusiness.update(id, justificationDto );
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating Justification: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update Justification Status Only (GraphQL)
    @DgsMutation
    public Map<String, Object> updateStatusInJustification(@InputArgument Long id, @InputArgument(name = "input") Long statusId) {
        try {
            justificationBusiness.UpdateStatusInJustification(id, statusId);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Status update ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating Justification status: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}