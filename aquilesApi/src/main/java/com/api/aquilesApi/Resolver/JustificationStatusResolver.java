package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.JustificationStatusBusiness;
import com.api.aquilesApi.Dto.JustificationStatusDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.Map;

@DgsComponent
public class JustificationStatusResolver {
    private final JustificationStatusBusiness justificationStatusBusiness;

    public JustificationStatusResolver(JustificationStatusBusiness justificationStatusBusiness) {
        this.justificationStatusBusiness = justificationStatusBusiness;
    }

    // FindAll JustificationStatus (GraphQL)
    @DgsQuery
    public Map<String, Object> allJustificationsStatus (@InputArgument Integer page, @InputArgument Integer size) {
        try {
            Page<JustificationStatusDto> justificationStatusDtoPage = justificationStatusBusiness.findAll(page, size);
            if (!justificationStatusDtoPage.isEmpty()){
                return ResponseHttpApi.responseHttpFindAll(
                        justificationStatusDtoPage.getContent(),
                        ResponseHttpApi.CODE_OK,
                        "Successfully Completed",
                        justificationStatusDtoPage.getSize(),
                        page,
                        justificationStatusDtoPage.getTotalPages());
            } else {
                return ResponseHttpApi.responseHttpFindAll(
                        null,
                        ResponseHttpApi.NO_CONTENT,
                        "State Justification not found",
                        0,
                        0,
                        0);
            }
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error getting JustificationStatus: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById JustificationStatus (GraphQL)
    @DgsQuery
    public Map<String, Object> justificationStatusById(@InputArgument Long id) {
        try {
            JustificationStatusDto justificationStatusDto = this.justificationStatusBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    justificationStatusDto,
                    ResponseHttpApi.CODE_OK,
                    "Successfully Completed");
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error getting JustificationStatus: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add JustificationStatus (GraphQL)
    @DgsMutation
    public Map<String, Object> addJustificationStatus(@InputArgument(name = "input") JustificationStatusDto justificationStatusDto) {
        try {
            JustificationStatusDto justificationStatusDto1 = justificationStatusBusiness.add(justificationStatusDto);
            return ResponseHttpApi.responseHttpAction(
                    justificationStatusDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding JustificationStatus: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update JustificationStatus (GraphQL)
    @DgsMutation
    public Map<String, Object> updateJustificationStatus(@InputArgument Long id, @InputArgument(name = "input") JustificationStatusDto justificationStatusDto) {
        try {
            justificationStatusBusiness.update(id, justificationStatusDto);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating JustificationStatus: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete JustificationStatus (GraphQL)
    @DgsMutation
    public Map<String, Object> deleteJustificationStatus(@InputArgument Long id) {
        try {
            justificationStatusBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting JustificationStatus: " +e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
