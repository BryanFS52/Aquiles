package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Business.JustificationTypeBusiness;
import com.api.aquilesApi.Dto.JustificationTypeDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import java.util.Map;

@Controller
public class JustificationTypeController {
    private final JustificationTypeBusiness justificationTypeBusiness;

    public JustificationTypeController(JustificationTypeBusiness justificationTypeBusiness) {
        this.justificationTypeBusiness = justificationTypeBusiness;
    }

    // FindAll JustificationTypes (GraphQL)
    @QueryMapping
    public Map<String, Object> allJustificationTypes(@Argument int page, @Argument int size) {
        try {
            Page<JustificationTypeDto> justificationtypeDtoPage = justificationTypeBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    justificationtypeDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    justificationtypeDtoPage.getTotalPages(),
                    page,
                    (int) justificationtypeDtoPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById JustificationType (GraphQL)
    @QueryMapping
    public Map<String, Object> justificationTypeById(@Argument Long id) {
        try {
            JustificationTypeDto justificationtypeDto = justificationTypeBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    justificationtypeDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new JustificationType (GraphQL)
    @MutationMapping
    public Map<String, Object> addJustificationType(@Argument("input") JustificationTypeDto justificationtypeDto) {
        try {
            JustificationTypeDto justificationTypeDto1 = justificationTypeBusiness.add(justificationtypeDto);
            return ResponseHttpApi.responseHttpAction(
                    justificationTypeDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        }catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding JustificationType: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update JustificationType (GraphQL)
    @MutationMapping
    public Map<String, Object> updateJustificationType(@Argument Long id, @Argument ("input")JustificationTypeDto justificationtypeDto) {
        try {
            justificationTypeBusiness.update(id, justificationtypeDto );
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating JustificationType: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Delete JustificationType (GraphQL)
    @MutationMapping
    public Map<String, Object> deleteJustificationType(@Argument Long id) {
        try {
            justificationTypeBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting JustificationType: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
