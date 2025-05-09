package com.api.aquilesApi.Controller;

import com.api.aquilesApi.Business.ExcusesBusiness;
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
    }

    // FindAll these excuses (GraphQL)
    @QueryMapping
    public Map<String, Object> allExcuses(@Argument int page, @Argument int size) {
        try {
            Page<ExcusesDto> excusesDtoPage = excusesBusiness.findAll(page, size);
            return ResponseHttpApi.responseHttpFindAll(
                    excusesDtoPage.getContent(),
                    ResponseHttpApi.CODE_OK,
                    "Query ok",
                    excusesDtoPage.getTotalPages(),
                    page,
                    (int) excusesDtoPage.getTotalElements()
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving excuses: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // FindById a excuse (GraphQL)
    @QueryMapping
    public Map<String, Object> excuseById(@Argument Long id) {
        try {
            ExcusesDto excusesDto = excusesBusiness.findById(id);
            return ResponseHttpApi.responseHttpFindId(
                    excusesDto,
                    ResponseHttpApi.CODE_OK,
                    "Query by id ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error retrieving excuse: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Add a new excuse (GraphQL)
    @MutationMapping
    public Map<String, Object> addExcuse(@Argument("input") ExcusesDto excusesDto) {
        try {
            ExcusesDto excusesDto1 = excusesBusiness.add(excusesDto);
            return ResponseHttpApi.responseHttpAction(
                    excusesDto1.getExcuseId(),
                    ResponseHttpApi.CODE_OK,
                    "Add ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error adding excuse: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update excuse (GraphQL)
    @MutationMapping
    public Map<String, Object> updateExcuse(@Argument Long id, @Argument("input") ExcusesDto excusesDto) {
        try {
            excusesBusiness.update(id, excusesDto);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Update ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error updating excuse: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Delete excuse (GraphQL)
    @MutationMapping
    public Map<String, Object> deleteExcuse(@Argument Long id) {
        try {
            excusesBusiness.delete(id);
            return ResponseHttpApi.responseHttpAction(
                    id,
                    ResponseHttpApi.CODE_OK,
                    "Delete ok"
            );
        } catch (Exception e) {
            return ResponseHttpApi.responseHttpError(
                    "Error deleting excuse: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}