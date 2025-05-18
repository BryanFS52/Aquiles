package com.api.aquilesApi.Controller;
import com.api.aquilesApi.Business.JuriesBusiness;
import com.api.aquilesApi.Dto.JuriesDto;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import org.springframework.data.domain.Page;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class JuriesController {
    private final JuriesBusiness juriesBusiness;

    public JuriesController(JuriesBusiness juriesBusiness) {
        this.juriesBusiness = juriesBusiness;
    }

    // FindAll Juries (GraphQL)
    @QueryMapping
    public Map<String, Object> allJuries(@Argument int page, @Argument int size) {
        try {
            Page<JuriesDto> juriesDtoPage = juriesBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    juriesDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    juriesDtoPage.getTotalPages(),
                    page,
                    (int) juriesDtoPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // FindById Jury (GraphQL)
    @QueryMapping
    public Map<String, Object> juryById (@Argument Long id) {
        try {
            JuriesDto juriesDto = juriesBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    juriesDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving attendances: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new Jury (GraphQL)
    @MutationMapping
    public Map<String, Object> addJury (@Argument("input") JuriesDto juriesDto) {
        try {
            JuriesDto
                    juriesDto1= juriesBusiness.add(juriesDto);
            return ResponseHttpApi.responseHttpAction(

                    juriesDto1.getId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        }catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding Jury: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update Jury (GraphQL)
    @MutationMapping
    public Map<String, Object> updateJury (@Argument Long id, @Argument ("input")JuriesDto juriesDto) {
        try {
            juriesBusiness.update(id, juriesDto );
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating Jury: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Delete Jury (GraphQL)
    @MutationMapping
    public Map<String, Object> deleteJury (@Argument Long id) {
        try {
            juriesBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        }
        catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting Jury: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}