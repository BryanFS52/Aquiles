package com.api.aquilesApi.Resolver;

import com.api.aquilesApi.Business.ExcusesBusiness;
import com.api.aquilesApi.Dto.ExcusesDto;
import com.api.aquilesApi.Utilities.DataConvert;
import com.api.aquilesApi.Utilities.Http.ResponseHttpApi;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.Map;

@DgsComponent
public class ExcusesController {
    private final ExcusesBusiness excusesBusiness;
    private final DataConvert dataConvert = new DataConvert();
    public ExcusesController(ExcusesBusiness excusesBusiness) {
        this.excusesBusiness = excusesBusiness;
    }

    // FindAll these excuses (GraphQL)
    @DgsQuery
    public Map<String, Object> allExcuses(@InputArgument Integer page, @InputArgument Integer size) {
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
    @DgsQuery
    public Map<String, Object> excuseById(@InputArgument String id) {
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            ExcusesDto excusesDto = excusesBusiness.findById(idLong);
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
    @DgsMutation
    public Map<String, Object> addExcuse(@InputArgument(name = "input") ExcusesDto excusesDto) {
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
    @DgsMutation
    public Map<String, Object> updateExcuse(@InputArgument String id, @InputArgument( name = "input")ExcusesDto excusesDto) {
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            excusesBusiness.update(idLong, excusesDto);
            return ResponseHttpApi.responseHttpAction(
                    idLong,
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
    @DgsMutation
    public Map<String, Object> deleteExcuse(@InputArgument String id) {
        try {
            Long idLong = dataConvert.parseLongOrNull(id);
            excusesBusiness.delete(idLong);
            return ResponseHttpApi.responseHttpAction(
                    idLong,
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